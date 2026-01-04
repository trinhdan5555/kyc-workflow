import { Router } from "express";

import kycApplicationsRoutes from "./kycApplications.routes";
import kycWebhooksRoutes from "./kycWebhooks.routes";

const router = Router();

// KYC application routes
router.use("/kyc", kycApplicationsRoutes);

// KYC provider webhooks
router.use("/kyc", kycWebhooksRoutes);

export default router;
