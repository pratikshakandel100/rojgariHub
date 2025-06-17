import getListingController from "../controller/listingController";
import express from "express";
const router = express.Router();

router.get("/listing", getListingController.getListing);

export default router;