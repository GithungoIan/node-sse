import express from "express";
import morgan from "morgan";
import cors from "cors";
import uploadRouter from "./routes/upload.routes";
import verificationRoutes from "./routes/verification.routes";
import globalErrorHandler from "./controllers/error.controller";
import { AppError } from "./utils/appError";
import compression from "compression";
import path from "path";
// @ts-ignore
import SSE = require("express-sse");

export const sse = new SSE([]);

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(compression());

app.use("/api/docs", uploadRouter);
app.use("/api/sse", sse.init);
app.use("/api/verify", verificationRoutes);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

export default app;
