import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DIRECT_URL or DATABASE_URL must be set.");
  process.exit(1);
}

// Set max to 2 to stay well within limits
const pool = new Pool({ connectionString, max: 2 });

// Known valid keys we expect in PHP serialized arrays
const VALID_KEYS = [
  "reviews per week",
  "reviews rating",
  "google business profile url",
  "google business profile url ",
  "google_business_profile_url",
  "additional instructions",
  "additional_instructions",
  "website url",
  "website_url",
  "social media page",
  "social_media_page",
  "profile_url",
  "review_type",
  "write_reviews_based_on_these_instructions",
  "review_content"
];

function parsePhpSerializedRegex(str: string): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    const regex = /s:\d+:"([\s\S]*?)";/g;
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      tokens.push(match[1]);
    }
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      const lowerToken = token.toLowerCase();
      if (VALID_KEYS.includes(lowerToken)) {
        const nextVal = tokens[i + 1];
        if (nextVal !== undefined) {
          map[token] = nextVal;
        }
      }
    }
  } catch {}
  return map;
}

interface ItemNote {
  itemId: string;
  platform: string;
  submissionType: "provide" | "expert";
  businessDetails: string;
  additionalInstructions: string;
}

async function main() {
  console.log("Starting high-performance PostgreSQL batch legacy review data migration...");

  let page = 0;
  const pageSize = 500;
  let processedOrders = 0;
  let updatedOrders = 0;
  let updatedDetails = 0;

  while (true) {
    const offset = page * pageSize;
    console.log(`Fetching orders chunk ${page + 1} (offset ${offset})...`);
    
    // Fetch orders
    const ordersRes = await pool.query(
      `SELECT id, notes, details_filled_at FROM public.orders ORDER BY id ASC LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    const orders = ordersRes.rows;
    if (orders.length === 0) {
      break;
    }

    const orderIds = orders.map((o) => o.id);

    // Fetch order details for these orders
    const detailsRes = await pool.query(
      `SELECT id, order_id, item_name, review_data FROM public.order_details WHERE order_id = ANY($1::int[])`,
      [orderIds]
    );

    const details = detailsRes.rows;

    // Group details by order_id
    const detailsByOrderId: Record<number, typeof details> = {};
    for (const d of details) {
      if (!detailsByOrderId[d.order_id]) {
        detailsByOrderId[d.order_id] = [];
      }
      detailsByOrderId[d.order_id].push(d);
    }

    const detailsToUpdate: Array<{ id: number; jsonReviewData: string }> = [];
    const ordersToUpdate: Array<{ id: number; notes: string }> = [];

    for (const order of orders) {
      processedOrders++;
      const itemNotes: ItemNote[] = [];
      const orderDetails = detailsByOrderId[order.id] || [];

      for (const detail of orderDetails) {
        const rawData = detail.review_data;
        if (!rawData || rawData === "NULL" || rawData.trim() === "") {
          continue;
        }

        let decoded = "";
        try {
          decoded = Buffer.from(rawData, "base64").toString("utf-8");
        } catch {
          continue;
        }

        // Check if it's a serialized PHP array
        if (!decoded.startsWith("a:") && !decoded.includes("s:")) {
          continue;
        }

        const parsed = parsePhpSerializedRegex(decoded);
        if (Object.keys(parsed).length === 0) {
          continue;
        }

        // Extract profileUrl
        const profileUrl =
          parsed["Google Business Profile URL"] ||
          parsed["Google Business Profile URL "] ||
          parsed["google_business_profile_url"] ||
          parsed["Website URL"] ||
          parsed["website_url"] ||
          parsed["Social Media Page"] ||
          parsed["social_media_page"] ||
          parsed["profile_url"] ||
          "";

        // Determine submissionType
        let submissionType: "expert" | "provide" = "provide";
        const reviewType = parsed["review_type"] || "";
        if (reviewType.toLowerCase().includes("expert")) {
          submissionType = "expert";
        }

        // Extract raw instructions / content
        const rawInstructions =
          parsed["write_reviews_based_on_these_instructions"] ||
          parsed["review_content"] ||
          parsed["Additional Instructions"] ||
          parsed["additional_instructions"] ||
          "";

        let businessDetails = "";
        let additionalInstructions = "";

        if (submissionType === "expert") {
          businessDetails = rawInstructions;
        } else {
          const detailsParts = [];
          if (parsed["Reviews Per Week"]) {
            detailsParts.push(`Reviews Per Week: ${parsed["Reviews Per Week"]}`);
          }
          if (parsed["Reviews Rating"]) {
            detailsParts.push(`Reviews Rating: ${parsed["Reviews Rating"]}`);
          }
          
          if (detailsParts.length > 0) {
            additionalInstructions = [...detailsParts, rawInstructions].filter(Boolean).join("\n");
          } else {
            additionalInstructions = rawInstructions;
          }
        }

        let platform = detail.item_name || "Google";
        if (platform.toLowerCase().endsWith(" reviews")) {
          platform = platform.substring(0, platform.length - 8).trim();
        }

        const jsonReviewData = JSON.stringify({ profileUrl });

        detailsToUpdate.push({
          id: detail.id,
          jsonReviewData,
        });

        itemNotes.push({
          itemId: detail.id.toString(),
          platform,
          submissionType,
          businessDetails,
          additionalInstructions,
        });
      }

      if (itemNotes.length > 0) {
        ordersToUpdate.push({
          id: order.id,
          notes: JSON.stringify(itemNotes),
        });
      }
    }

    // Perform bulk details update
    if (detailsToUpdate.length > 0) {
      const params: any[] = [];
      const valueRows: string[] = [];
      for (let idx = 0; idx < detailsToUpdate.length; idx++) {
        const update = detailsToUpdate[idx];
        const p1Idx = idx * 2 + 1;
        const p2Idx = idx * 2 + 2;
        params.push(update.id, update.jsonReviewData);
        valueRows.push(`($${p1Idx}::int, $${p2Idx}::text)`);
      }

      await pool.query(
        `UPDATE public.order_details AS od
         SET review_data = val.review_data,
             updated_at = NOW()
         FROM (VALUES ${valueRows.join(", ")}) AS val(id, review_data)
         WHERE od.id = val.id`,
        params
      );
      updatedDetails += detailsToUpdate.length;
    }

    // Perform bulk orders update
    if (ordersToUpdate.length > 0) {
      const params: any[] = [];
      const valueRows: string[] = [];
      for (let idx = 0; idx < ordersToUpdate.length; idx++) {
        const update = ordersToUpdate[idx];
        const p1Idx = idx * 2 + 1;
        const p2Idx = idx * 2 + 2;
        params.push(update.id, update.notes);
        valueRows.push(`($${p1Idx}::int, $${p2Idx}::text)`);
      }

      await pool.query(
        `UPDATE public.orders AS o
         SET notes = val.notes,
             details_filled = true,
             details_filled_at = COALESCE(o.details_filled_at, NOW()),
             updated_at = NOW()
         FROM (VALUES ${valueRows.join(", ")}) AS val(id, notes)
         WHERE o.id = val.id`,
        params
      );
      updatedOrders += ordersToUpdate.length;
    }

    console.log(`Progress: Processed ${processedOrders} orders. Updated ${updatedOrders} orders, ${updatedDetails} details.`);
    page++;
  }

  console.log(`\nMigration completed successfully!`);
  console.log(`- Total orders processed: ${processedOrders}`);
  console.log(`- Total orders updated with notes: ${updatedOrders}`);
  console.log(`- Total order details updated with JSON reviewData: ${updatedDetails}`);
}

main()
  .catch((e) => {
    console.error("❌ Migration failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
