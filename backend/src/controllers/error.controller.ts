import { AppError } from "../utils/appError";
import { Request, Response } from "express";

const sendErrorDev = (req: Request, res: Response, err: AppError) => {
  console.log("🔥 🔥 ");
  if (req.originalUrl.startsWith("/api")) {
    console.log("🔥 🔥 ");
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

export default (err: any, res: any, req: any) => {
  console.log("Error at Gloabl Error handler");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(req, res, err);
  }
};
