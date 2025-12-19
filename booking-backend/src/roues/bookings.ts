import express from "express";
import {
    cancelBooking,
    createBooking,
    deleteBooking,
    getBooking,
    listBookings
} from "../controllers/bookingController";

const router = express.Router();

router.get("/", listBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.patch("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);

export default router;
