export type ProviderWebhookEvent = {
  eventId: string;
  applicationId: string;
  type: "provider.kyc.approved" | "provider.kyc.rejected";
  timestamp: string;
};
