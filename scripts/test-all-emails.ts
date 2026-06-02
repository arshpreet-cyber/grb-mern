/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Email Trigger Test Script
 * ──────────────────────────────────────────────────────────────────────────────
 * Tests all 18 email events (EVT-0001 through EVT-0018) by directly calling
 * the email builder + sender functions from server/email.ts.
 *
 * Usage:
 *   npx tsx scripts/test-all-emails.ts
 *
 * The script sends all emails to the ADMIN_EMAIL address configured in .env
 * (currently: mohit@adaired.org). Each email is tagged in the subject so you
 * can quickly identify which event fired.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import "dotenv/config";

import {
  sendEmailNotification,
  ADMIN_EMAIL,
  buildRegistrationAdminEmail,
  buildWelcomeEmail,
  buildUnpaidReminderEmail,
  buildOrderPaidEmail,
  buildSubscriptionAdminEmail,
  buildOrderStatusEmail,
  buildOrderCreatedEmail,
  buildTicketCreatedEmail,
  buildTicketHoldEmail,
  buildTicketEscalatedEmail,
  buildOrderInfoRequiredEmail,
  buildUserSubmittedDetailsAdminEmail,
  buildContactConfirmationEmail,
  buildTicketClosedEmail,
} from "../server/email.ts";

const TO = ADMIN_EMAIL || process.env.EMAIL_FROM || "";
if (!TO) {
  console.error("❌ No ADMIN_EMAIL or EMAIL_FROM set in .env — cannot run tests.");
  process.exit(1);
}

console.log(`\n📬 Sending all test emails to: ${TO}\n`);

interface TestCase {
  eventId: string;
  description: string;
  send: () => Promise<void>;
}

const SITE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://getreviews.buzz";

const tests: TestCase[] = [
  // ─── EVT-0001 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0001",
    description: "Admin – New User Registration (Welcome Email to Admin)",
    send: async () => {
      const { subject, html } = buildRegistrationAdminEmail({
        name: "Test User",
        email: "testuser@example.com",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0001] ${subject}`,
        text: "Test: New user registered.",
        html,
      });
    },
  },

  // ─── EVT-0002 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0002",
    description: "User – Email Verification",
    send: async () => {
      const { subject, html } = buildWelcomeEmail({ name: "Test User", verifyUrl: `${SITE_URL}/verify?token=test-token-123` });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0002] ${subject}`,
        text: "Test: Email verification.",
        html,
      });
    },
  },

  // ─── EVT-0003 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0003",
    description: "User – Unpaid Order Reminder",
    send: async () => {
      const { subject, html } = buildUnpaidReminderEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0003",
        items: [
          { platform: "Google Reviews", qty: 10, pricePerUnit: 5 },
          { platform: "Yelp Reviews", qty: 5, pricePerUnit: 8 },
        ],
        total: 90,
        payUrl: `${SITE_URL}/checkout/test-pay`,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0003] ${subject}`,
        text: "Test: Unpaid order reminder.",
        html,
      });
    },
  },

  // ─── EVT-0004 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0004",
    description: "User – Payment Successful",
    send: async () => {
      const { subject, html } = buildOrderPaidEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0004",
        items: [
          { platform: "Google Reviews", qty: 10, pricePerUnit: 5 },
        ],
        total: 50,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0004] ${subject}`,
        text: "Test: Payment successful.",
        html,
      });
    },
  },

  // ─── EVT-0005 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0005",
    description: "Admin – New Subscription",
    send: async () => {
      const { subject, html } = buildSubscriptionAdminEmail({
        email: "subscriber@example.com",
        orderNumber: "TEST-0005",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0005] ${subject}`,
        text: "Test: New subscription.",
        html,
      });
    },
  },

  // ─── EVT-0006 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0006",
    description: "User – Order Status: Hold",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0006",
        status: "4", // Hold
        items: [{ platform: "Google Reviews", qty: 5, pricePerUnit: 5 }],
        total: 25,
        amountPaid: 25,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0006] ${subject}`,
        text: "Test: Order on hold.",
        html,
      });
    },
  },

  // ─── EVT-0007 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0007",
    description: "User – Order Status: Refunded",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0007",
        status: "6", // Refunded
        items: [{ platform: "Yelp Reviews", qty: 3, pricePerUnit: 10 }],
        total: 30,
        amountPaid: 30,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0007] ${subject}`,
        text: "Test: Order refunded.",
        html,
      });
    },
  },

  // ─── EVT-0008 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0008",
    description: "User – Order Status: Failed",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0008",
        status: "7", // Failed
        items: [{ platform: "Google Reviews", qty: 2, pricePerUnit: 5 }],
        total: 10,
        amountPaid: 0,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0008] ${subject}`,
        text: "Test: Order failed.",
        html,
      });
    },
  },

  // ─── EVT-0009 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0009",
    description: "User – Order Status: Pending",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0009",
        status: "1", // Pending
        items: [{ platform: "TripAdvisor Reviews", qty: 5, pricePerUnit: 6 }],
        total: 30,
        amountPaid: 0,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0009] ${subject}`,
        text: "Test: Order pending.",
        html,
      });
    },
  },

  // ─── EVT-0010 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0010",
    description: "User – Order Status: Cancelled",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0010",
        status: "5", // Cancelled
        items: [{ platform: "Google Reviews", qty: 10, pricePerUnit: 5 }],
        total: 50,
        amountPaid: 50,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0010] ${subject}`,
        text: "Test: Order cancelled.",
        html,
      });
    },
  },

  // ─── EVT-0011 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0011",
    description: "User – Order Status: Completed",
    send: async () => {
      const { subject, html } = buildOrderStatusEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0011",
        status: "3", // Completed
        items: [{ platform: "Google Reviews", qty: 20, pricePerUnit: 5 }],
        total: 100,
        amountPaid: 100,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0011] ${subject}`,
        text: "Test: Order completed.",
        html,
      });
    },
  },

  // ─── EVT-0012 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0012",
    description: "User – Ticket Created (Thank You)",
    send: async () => {
      const { subject, html } = buildTicketCreatedEmail({
        name: "Test User",
        email: "testuser@example.com",
        ticketNumber: "TKT-TEST0012",
        subject: "Test support ticket",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0012] ${subject}`,
        text: "Test: Ticket created.",
        html,
      });
    },
  },

  // ─── EVT-0013 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0013",
    description: "User – Ticket On Hold",
    send: async () => {
      const { subject, html } = buildTicketHoldEmail({
        name: "Test User",
        ticketNumber: "TKT-TEST0013",
        subject: "Test support ticket on hold",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0013] ${subject}`,
        text: "Test: Ticket on hold.",
        html,
      });
    },
  },

  // ─── EVT-0014 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0014",
    description: "User – Ticket Escalated",
    send: async () => {
      const { subject, html } = buildTicketEscalatedEmail({
        name: "Test User",
        ticketNumber: "TKT-TEST0014",
        subject: "Test support ticket escalated",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0014] ${subject}`,
        text: "Test: Ticket escalated.",
        html,
      });
    },
  },

  // ─── EVT-0015 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0015",
    description: "User – Order Information Required",
    send: async () => {
      const { subject, html } = buildOrderInfoRequiredEmail({
        name: "Test User",
        orderNumber: "TEST-0015",
        detailsUrl: `${SITE_URL}/order/test-id/details`,
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0015] ${subject}`,
        text: "Test: Order info required.",
        html,
      });
    },
  },

  // ─── EVT-0016 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0016",
    description: "Admin – User Submitted Order Details",
    send: async () => {
      const { subject, html } = buildUserSubmittedDetailsAdminEmail({
        name: "Test User",
        email: "testuser@example.com",
        orderNumber: "TEST-0016",
        orderId: "test-order-id-0016",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0016] ${subject}`,
        text: "Test: User submitted order details.",
        html,
      });
    },
  },

  // ─── EVT-0017 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0017",
    description: "User – Contact Us Confirmation",
    send: async () => {
      const { subject, html } = buildContactConfirmationEmail({
        email: "testuser@example.com",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0017] ${subject}`,
        text: "Test: Contact confirmation.",
        html,
      });
    },
  },

  // ─── EVT-0018 ──────────────────────────────────────────────────────────────
  {
    eventId: "EVT-0018",
    description: "User – Ticket Closed",
    send: async () => {
      const { subject, html } = buildTicketClosedEmail({
        name: "Test User",
        ticketNumber: "TKT-TEST0018",
        subject: "Test closed ticket",
      });
      await sendEmailNotification({
        to: TO,
        subject: `[TEST EVT-0018] ${subject}`,
        text: "Test: Ticket closed.",
        html,
      });
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Runner
// ────────────────────────────────────────────────────────────────────────────
async function runAll() {
  const results: { eventId: string; description: string; status: string; error?: string }[] = [];

  for (const test of tests) {
    process.stdout.write(`  ⏳ ${test.eventId} — ${test.description}... `);
    try {
      await test.send();
      process.stdout.write("✅ SENT\n");
      results.push({ eventId: test.eventId, description: test.description, status: "✅ SENT" });
    } catch (err: any) {
      process.stdout.write(`❌ FAILED: ${err.message}\n`);
      results.push({ eventId: test.eventId, description: test.description, status: "❌ FAILED", error: err.message });
    }
    // Small delay to avoid SMTP rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n" + "═".repeat(80));
  console.log("  EMAIL TEST RESULTS SUMMARY");
  console.log("═".repeat(80));
  console.log("");

  const passed = results.filter((r) => r.status.includes("SENT")).length;
  const failed = results.filter((r) => r.status.includes("FAILED")).length;

  for (const r of results) {
    console.log(`  ${r.status}  ${r.eventId}  ${r.description}${r.error ? ` → ${r.error}` : ""}`);
  }

  console.log("");
  console.log(`  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("═".repeat(80));
  console.log(`\n📧 All emails were sent to: ${TO}`);
  console.log("   Check your inbox (and spam folder) for emails prefixed with [TEST EVT-xxxx]\n");
}

runAll().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
