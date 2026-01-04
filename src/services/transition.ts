import { KycEvent, KycStatus } from "../types";

const TERMINAL: KycStatus[] = ["APPROVED", "REJECTED"];

export function transition(
  current: KycStatus,
  event: KycEvent
): KycStatus {
  // Terminal states are final
  if (TERMINAL.includes(current)) {
    return current;
  }

  switch (current) {
    case "CREATED":
      if (event.type === "DOCS_COMPLETED") {
        return "DOCS_SUBMITTED";
      }
      return current;

    case "DOCS_SUBMITTED":
      if (event.type === "SEND_TO_PROVIDER") {
        return "PENDING_REVIEW";
      }
      return current;

    case "PENDING_REVIEW":
      if (event.type === "PROVIDER_APPROVED") {
        return "APPROVED";
      }
      if (event.type === "PROVIDER_REJECTED") {
        return "REJECTED";
      }
      return current;

    default:
      return current;
  }
}
