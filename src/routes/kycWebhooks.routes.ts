import { Router } from "express";
import { ProviderWebhookEvent } from "../types";
import { FileStore, processWebhook } from "../services";

const router = Router();
const store = new FileStore();

/**
 * POST /kyc/webhooks/provider
 */
router.post("/webhooks/provider", (req, res) => {
  const event = req.body as ProviderWebhookEvent;

  if (!event.eventId || !event.applicationId || !event.type) {
    return res.status(400).json({ error: "INVALID_EVENT" });
  }

  try {
    processWebhook(store, event);
    res.status(200).json({ ok: true });
  } catch {
    res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
  }
});

export default router;
