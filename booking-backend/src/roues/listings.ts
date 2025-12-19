import express from "express";
import {
    createListing,
    deleteListing,
    getListing,
    listListings,
    updateListing,
} from "../controllers/listingController";

const router = express.Router();

router.get("/", listListings);
router.get("/:id", getListing);
router.post("/", createListing);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
