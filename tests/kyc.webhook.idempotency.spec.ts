import { describe, it, expect } from "vitest";
import {
  createApplication,
  attachDocument,
  processWebhook,
} from "../src/services";
import { MockStore } from "./mocks/MockStore";

describe("KYC – webhook idempotency", () => {
  it("applies the same webhook event only once", () => {
    const store = new MockStore();

    // 1️⃣ Create application
    const app = createApplication(store, "customer_123");
    expect(app.status).toBe("CREATED");

    // 2️⃣ Upload all required docs → PENDING_REVIEW
    attachDocument(store, app.id, { type: "ID_FRONT", ref: "front" });
    attachDocument(store, app.id, { type: "ID_BACK", ref: "back" });
    const ready = attachDocument(store, app.id, {
      type: "SELFIE",
      ref: "selfie",
    });

    expect(ready.status).toBe("PENDING_REVIEW");

    // 3️⃣ Provider webhook payload
    const payload = {
      eventId: "evt_123",
      applicationId: app.id,
      type: "provider.kyc.approved" as const,
      timestamp: "2026-01-04T17:00:00Z",
    };

    // 4️⃣ First delivery → applied
    const first = processWebhook(store, payload);

    expect(first.status).toBe("APPROVED");

    // 5️⃣ Same event delivered again → ignored
    const second = processWebhook(store, {
      ...payload,
      eventId: "evt_1234",
      type: "provider.kyc.rejected"
    });

    expect(first.status).toBe("APPROVED");
    expect(second.lastProviderEventId).toBe("evt_123");
  });
});
