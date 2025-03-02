import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import contentBD from "./config/mongodb.js";

const app = express();
const port = process.env.PORT || 4000;
contentBD();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => res.send("API working..."));

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
