import { Router } from "express";
import {
  createApplication,
  attachDocument,
  getApplication,
  FileStore
} from "../services";
import { DocumentType, KycDocument } from "../types";

const router = Router();
const store = new FileStore();

/**
 * POST /kyc/applications
 */
router.post("/applications", (req, res) => {
  const { customerId } = req.body as { customerId?: string };

  if (!customerId) {
    return res.status(400).json({ error: "customerId required" });
  }

  try {
    const app = createApplication(store, customerId);
    return res.status(200).json(app);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /kyc/applications/:id/documents
 */
router.post("/applications/:id/documents", (req, res) => {
  const { type, ref } = req.body as KycDocument;

  if (!type || !ref) {
    return res.status(400).json({ error: "type and ref required" });
  }

  try {
    const app = attachDocument(store, req.params.id, { type, ref });
    res.status(200).json(app);
  } catch {
    res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
  }
});

/**
 * GET /kyc/applications/:id
 */
router.get("/applications/:id", (req, res) => {
  const app = getApplication(store, req.params.id);

  if (!app) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  res.status(200).json(app);
});

export default router;
