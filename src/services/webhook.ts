import { ProviderWebhookEvent, KycApplication, StoreAdapter } from "../types";

const FINAL_STATES = new Set<KycApplication["status"]>([
  "APPROVED",
  "REJECTED"
]);

export function processWebhook(
  store: StoreAdapter,
  event: ProviderWebhookEvent
): KycApplication {
  const data = store.read();

  const application = data.applications.find(
    app => app.id === event.applicationId
  );

  if (!application) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  // Do not allow transitions out of final states
  if (FINAL_STATES.has(application.status)) {
    return application;
  }

  // Idempotency check (provider retries)
  if (application.lastProviderEventId === event.eventId) {
    return application;
  }

  switch (event.type) {
    case "provider.kyc.approved":
      application.status = "APPROVED";
      break;

    case "provider.kyc.rejected":
      application.status = "REJECTED";
      break;

    default:
      // Unknown events are safely ignored
      return application;
  }

  application.lastProviderEventId = event.eventId;
  application.updatedAt = new Date().toISOString();

  store.write(data);

  return application;
}
