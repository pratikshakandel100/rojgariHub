import * as listingController from "../controller/listingController.js";
import express from "express";
const router = express.Router();

router.post("/add", listingController.addListing);
router.get("/all", listingController.getAllListing);
router.get("/:meroId", listingController.getListingById)
router.delete("/:mero_Id", listingController.deleteListingById)
router.patch("/:Id", listingController.updateLisiting);
export default router;