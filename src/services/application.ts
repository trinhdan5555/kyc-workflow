import { v4 as uuid } from "uuid";
import {
  KycApplication,
  KycDocument,
  KycStatus, StoreAdapter
} from "../types";
import { transition } from "./transition";
import { FileStore } from "./store";

const REQUIRED_DOCS: KycDocument["type"][] = [
  "ID_FRONT",
  "ID_BACK",
  "SELFIE"
];

const FINAL_STATES = new Set<KycStatus>([
  "APPROVED",
  "REJECTED"
]);

/**
 * Create a new KYC application
 * Initial state: CREATED
 */
export function createApplication(
  store: FileStore,
  customerId: string
): KycApplication {

  const data = store.read();
  const now = new Date().toISOString();

  const application: KycApplication = {
    id: `app_${uuid()}`,
    customerId,
    status: transition("CREATED", { type: "CREATE" }),
    documents: [],
    createdAt: now,
    updatedAt: now,
  };

  data.applications.push(application);
  store.write(data);

  return application;
}

/**
 * Attach a document reference (metadata only)
 * Handles state transitions:
 * CREATED -> DOCS_SUBMITTED -> PENDING_REVIEW
 */
export function attachDocument(
  store: FileStore,
  applicationId: string,
  document: KycDocument
): KycApplication {
  const data = store.read();

  const application = data.applications.find(
    app => app.id === applicationId
  );

  if (!application) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  // No mutations allowed after final state
  if (FINAL_STATES.has(application.status)) {
    return application;
  }

  // Prevent duplicate document types
  const alreadyUploaded = application.documents.some(
    d => d.type === document.type
  );

  if (!alreadyUploaded) {
    application.documents.push(document);
  }

  const uploadedTypes = new Set(
    application.documents.map(d => d.type)
  );

  const hasAllRequiredDocs = REQUIRED_DOCS.every(
    type => uploadedTypes.has(type)
  );

  if (hasAllRequiredDocs) {
    application.status = transition(
      application.status,
      { type: "DOCS_COMPLETED" }
    );

    // Implicit send to provider
    application.status = transition(
      application.status,
      { type: "SEND_TO_PROVIDER" }
    );
  }

  application.updatedAt = new Date().toISOString();
  store.write(data);

  return application;
}

/**
 * Fetch an application by ID
 */
export function getApplication(
  store: FileStore,
  applicationId: string
): KycApplication | undefined {
  const data = store.read();

  return data.applications.find(
    app => app.id === applicationId
  );
}
