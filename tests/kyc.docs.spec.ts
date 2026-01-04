import { describe, it, expect } from "vitest";
import { createApplication, attachDocument } from "../src/services";
import { MockStore } from "./mocks/MockStore";

describe("KYC – document workflow", () => {
  it("status changes after all required docs are uploaded", () => {
    const store = new MockStore();
    const app = createApplication(store, "customer_a1");
    expect(app.status).toBe("CREATED");

    const afterFirstDoc = attachDocument(store, app.id, {
      type: "ID_FRONT",
      ref: "front_ref",
    });

    // Status must remain CREATED
    expect(afterFirstDoc.status).toBe("CREATED");

    const afterSecondDoc = attachDocument(store, app.id, {
      type: "ID_FRONT",
      ref: "front_ref",
    });

    // Status must remain CREATED
    expect(afterSecondDoc.status).toBe("CREATED");

    attachDocument(store, app.id, {
      type: "ID_BACK",
      ref: "back_ref",
    });

    const finalDoc = attachDocument(store, app.id, {
      type: "SELFIE",
      ref: "selfie_ref",
    });

    expect(finalDoc.status).toBe("PENDING_REVIEW1");
  });
});
