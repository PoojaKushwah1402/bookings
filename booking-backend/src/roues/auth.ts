import express from "express";

const app = express();

app.use("/login");
app.use("/register");
app.use("/logout");

export default app;
