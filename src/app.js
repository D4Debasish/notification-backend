import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "true" }));
app.use(cookieParser());
app.get("/", (req, res, next) => {
  res.send(
    '<h2 style="color: red; alignItems:center;">THIS IS A SERVER BY DEBU</h2>'
  );
});

// Router
import Routess from "./routes/api.routes.js";

app.use("/api", Routess);

export { app };
