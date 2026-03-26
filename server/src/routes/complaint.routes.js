// routes/complaint.routes.js

import express from "express";
import * as complaintController from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", complaintController.fileComplaint);

export default router;