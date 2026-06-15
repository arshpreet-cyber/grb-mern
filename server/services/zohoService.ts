
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;
const ZOHO_DEPARTMENT_ID = process.env.ZOHO_DEPARTMENT_ID;
const ZOHO_FROM_EMAIL = process.env.ZOHO_FROM_EMAIL; // Zoho Desk "from" address for sendReply

// Zoho data center is region-specific (.com, .in, .eu, ...). Drive it from env so
// the account's data center can be set without code changes. Defaults to .com.
// Set ZOHO_DC=in (or eu, etc.) or override the full URLs via ZOHO_ACCOUNTS_URL / ZOHO_DESK_URL.
const ZOHO_DC = process.env.ZOHO_DC || "com";
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || `https://accounts.zoho.${ZOHO_DC}`;
const ZOHO_DESK_URL = process.env.ZOHO_DESK_URL || `https://desk.zoho.${ZOHO_DC}/api/v1`;

let currentAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Checks if all required Zoho credentials are present in environment variables
 */
export function isZohoConfigured(): boolean {
  return !!(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN && ZOHO_ORG_ID && ZOHO_DEPARTMENT_ID);
}

/**
 * Checks if Zoho Desk email sending is configured (requires ZOHO_FROM_EMAIL)
 */
export function isZohoEmailConfigured(): boolean {
  return isZohoConfigured() && !!ZOHO_FROM_EMAIL;
}

/**
 * Gets a fresh Zoho access token using the refresh token
 */
export async function getZohoAccessToken(): Promise<string> {
  if (currentAccessToken && Date.now() < tokenExpiresAt) {
    return currentAccessToken;
  }

  if (!isZohoConfigured()) {
    throw new Error("Missing Zoho OAuth credentials in environment variables.");
  }

  const url = `${ZOHO_ACCOUNTS_URL}/oauth/v2/token?refresh_token=${ZOHO_REFRESH_TOKEN}&client_id=${ZOHO_CLIENT_ID}&client_secret=${ZOHO_CLIENT_SECRET}&grant_type=refresh_token`;

  try {
    const response = await fetch(url, { method: "POST" });
    const data = await response.json() as any;

    if (data.error) {
      throw new Error(`Zoho auth error: ${data.error}`);
    }

    currentAccessToken = data.access_token;
    // Token expires in 3600 seconds, subtract 60s for buffer
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return currentAccessToken!;
  } catch (error) {
    console.error("Failed to fetch Zoho access token", error);
    throw error;
  }
}

export type ZohoTicketPayload = {
  subject: string;
  description?: string;
  departmentId?: string;
  channel?: string;
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

export type ZohoTicketResult = {
  zohoTicketId: string;
  zohoTicketNumber: string;
};

/**
 * Creates a ticket in Zoho Desk
 */
export async function createZohoTicket(payload: ZohoTicketPayload): Promise<ZohoTicketResult> {
  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) {
    throw new Error("Missing ZOHO_ORG_ID in environment variables");
  }

  const departmentId = payload.departmentId || ZOHO_DEPARTMENT_ID;
  if (!departmentId) {
    throw new Error("Missing ZOHO_DEPARTMENT_ID in environment variables");
  }

  const zohoPayload: Record<string, any> = {
    departmentId,
    subject: payload.subject,
    description: payload.description || "No description provided.",
    contact: {
      email: payload.contact.email,
      lastName: payload.contact.lastName || payload.contact.firstName || "Unknown",
      firstName: payload.contact.firstName,
      phone: payload.contact.phone,
    },
  };

  // If email channel is configured, set the channel to Email
  if (payload.channel) {
    zohoPayload.channel = payload.channel;
  }

  try {
    const response = await fetch(`${ZOHO_DESK_URL}/tickets`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zohoPayload),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      throw new Error(`Zoho API error: ${JSON.stringify(data)}`);
    }

    return {
      zohoTicketId: data.id,
      zohoTicketNumber: data.ticketNumber,
    };
  } catch (error) {
    console.error("Failed to create Zoho ticket", error);
    throw error;
  }
}

/**
 * Adds a reply/comment to an existing Zoho ticket
 */
export async function addZohoTicketReply(zohoTicketId: string, content: string, isAgent: boolean = false): Promise<void> {
  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) {
    throw new Error("Missing ZOHO_ORG_ID in environment variables");
  }

  // To simulate user replies, we use the "sendReply" or "comments" endpoint.
  // For simplicity, we can add a comment to the ticket, or reply to a thread.
  // Comments: POST /tickets/{ticketId}/comments
  // Replies: POST /tickets/{ticketId}/sendReply
  
  // Here we add it as a comment for simplicity. If we want it to be an actual reply to the customer, we can use sendReply.
  // We'll use the comments endpoint which is straightforward for syncing messages.
  const endpoint = `${ZOHO_DESK_URL}/tickets/${zohoTicketId}/comments`;
  const zohoPayload = {
    content,
    isPublic: true, // Make comment visible to end user
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zohoPayload),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      throw new Error(`Zoho API error: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("Failed to add Zoho ticket reply", error);
    throw error;
  }
}

/**
 * Sends an email reply via Zoho Desk's sendReply API.
 * Requires ZOHO_FROM_EMAIL to be set (a verified email in Zoho Desk's email channel).
 * Replies to this email will automatically be captured by Zoho Desk.
 */
export async function sendZohoTicketEmail(opts: {
  zohoTicketId: string;
  to: string;
  cc?: string;
  subject?: string;
  contentHtml: string;
}): Promise<boolean> {
  if (!ZOHO_FROM_EMAIL) {
    console.log("[ZOHO-EMAIL] ZOHO_FROM_EMAIL not configured. Cannot send email via Zoho Desk.");
    return false;
  }

  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) {
    throw new Error("Missing ZOHO_ORG_ID in environment variables");
  }

  const payload: Record<string, any> = {
    channel: "EMAIL",
    to: opts.to,
    fromEmailAddress: ZOHO_FROM_EMAIL,
    contentType: "html",
    content: opts.contentHtml,
    isForward: "false",
  };

  if (opts.cc) {
    payload.cc = opts.cc;
  }

  try {
    const response = await fetch(`${ZOHO_DESK_URL}/tickets/${opts.zohoTicketId}/sendReply`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error(`[ZOHO-EMAIL] sendReply failed (${response.status}):`, JSON.stringify(data));
      return false;
    }

    console.log(`[ZOHO-EMAIL] ✅ Email sent for ticket ${opts.zohoTicketId} to ${opts.to}`);
    return true;
  } catch (error) {
    console.error("[ZOHO-EMAIL] Failed to send email via Zoho Desk", error);
    return false;
  }
}

/**
 * Fetch threads (email conversations) for a Zoho Desk ticket.
 * Returns an array of thread objects.
 */
export async function getZohoTicketThreads(zohoTicketId: string): Promise<any[]> {
  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) return [];

  try {
    const response = await fetch(`${ZOHO_DESK_URL}/tickets/${zohoTicketId}/threads`, {
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[ZOHO] Failed to fetch threads for ticket ${zohoTicketId}: ${response.status}`, text.substring(0, 200));
      return [];
    }

    const data = (await response.json()) as any;
    return data.data || [];
  } catch (error) {
    console.error(`[ZOHO] Error fetching threads for ticket ${zohoTicketId}:`, error);
    return [];
  }
}

/**
 * Fetch a page of tickets from Zoho Desk.
 * `from` is 1-based; `limit` max is 100. Sorted by -modifiedTime by default so
 * the most recently active tickets come first. Includes contact info.
 */
export async function getZohoTickets(
  from: number = 1,
  limit: number = 100,
  sortBy: string = "-modifiedTime"
): Promise<any[]> {
  const token = await getZohoAccessToken();
  if (!ZOHO_ORG_ID) return [];

  const url = `${ZOHO_DESK_URL}/tickets?from=${from}&limit=${limit}&sortBy=${sortBy}&include=contacts`;
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[ZOHO] Failed to list tickets (from=${from}): ${response.status}`, text.substring(0, 200));
      return [];
    }

    const data = (await response.json()) as any;
    return data.data || [];
  } catch (error) {
    console.error(`[ZOHO] Error listing tickets (from=${from}):`, error);
    return [];
  }
}

/**
 * Fetch a single thread's full content (the threads-list endpoint only returns a
 * short summary; plainText/content come from the per-thread endpoint).
 */
export async function getZohoThreadDetail(zohoTicketId: string, threadId: string): Promise<any | null> {
  const token = await getZohoAccessToken();
  if (!ZOHO_ORG_ID) return null;
  try {
    const r = await fetch(`${ZOHO_DESK_URL}/tickets/${zohoTicketId}/threads/${threadId}`, {
      headers: { "Authorization": `Zoho-oauthtoken ${token}`, "orgId": ZOHO_ORG_ID },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/**
 * Fetch comments for a Zoho Desk ticket.
 */
export async function getZohoTicketComments(zohoTicketId: string): Promise<any[]> {
  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) return [];

  try {
    const response = await fetch(`${ZOHO_DESK_URL}/tickets/${zohoTicketId}/comments`, {
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "orgId": ZOHO_ORG_ID,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[ZOHO] Failed to fetch comments for ticket ${zohoTicketId}: ${response.status}`, text.substring(0, 200));
      return [];
    }

    const data = (await response.json()) as any;
    return data.data || [];
  } catch (error) {
    console.error(`[ZOHO] Error fetching comments for ticket ${zohoTicketId}:`, error);
    return [];
  }
}
