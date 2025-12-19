import express from "express";
import cors from "cors";
import routes from "./roues/index";

import dotenv from "dotenv";
dotenv.config();

import {pool} from "./db/pool";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});
app.get("/db-check", async (_req, res) => {
    const result = await pool.query("SELECT NOW() as now");
    res.json(result.rows[0]);
});

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
