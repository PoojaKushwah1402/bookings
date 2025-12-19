import express from "express";
import auth from "./auth";
import bookings from "./bookings";
import listings from "./listings";

const app = express();

app.use("/auth", auth);
app.use("/listings", listings);
app.use("/bookings", bookings);

export default app;
