import express from "express";

const app = express();

app.get("/");
app.get("/:id");
app.post("/");
app.patch("/:id");
app.delete("/:id");

export default app;
