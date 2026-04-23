
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;
const ZOHO_DEPARTMENT_ID = process.env.ZOHO_DEPARTMENT_ID;

// Use your actual Zoho domain, default to .in or .com. Using .in here as fallback or whatever matches the env
const ZOHO_ACCOUNTS_URL = "https://accounts.zoho.in";
const ZOHO_DESK_URL = "https://desk.zoho.in/api/v1";

let currentAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Checks if all required Zoho credentials are present in environment variables
 */
export function isZohoConfigured(): boolean {
  return !!(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN && ZOHO_ORG_ID && ZOHO_DEPARTMENT_ID);
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
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

/**
 * Creates a ticket in Zoho Desk
 */
export async function createZohoTicket(payload: ZohoTicketPayload): Promise<string> {
  const token = await getZohoAccessToken();

  if (!ZOHO_ORG_ID) {
    throw new Error("Missing ZOHO_ORG_ID in environment variables");
  }

  const departmentId = payload.departmentId || ZOHO_DEPARTMENT_ID;
  if (!departmentId) {
    throw new Error("Missing ZOHO_DEPARTMENT_ID in environment variables");
  }

  const zohoPayload = {
    departmentId,
    subject: payload.subject,
    description: payload.description || "No description provided.",
    contact: {
      email: payload.contact.email,
      lastName: payload.contact.lastName || payload.contact.firstName || "Unknown",
      firstName: payload.contact.firstName,
      phone: payload.contact.phone,
    },
    // Optional: map other fields if needed
  };

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

    return data.id; // Returns the Zoho Ticket ID
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
