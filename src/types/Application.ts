import { KycDocument } from "./Document";

export type KycStatus =
  | "CREATED"
  | "DOCS_SUBMITTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type KycApplication = {
  id: string;
  customerId: string;
  status: KycStatus;
  documents: KycDocument[];
  createdAt: string;
  updatedAt: string;
  lastProviderEventId?: string;
};

export type KycEvent =
  | { type: "CREATE" }
  | { type: "DOCS_COMPLETED" }
  | { type: "SEND_TO_PROVIDER" }
  | { type: "PROVIDER_APPROVED" }
  | { type: "PROVIDER_REJECTED" };

