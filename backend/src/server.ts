import dotenv from "dotenv";

process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught Exception 🔥 ... shuting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
import app from "./app";

dotenv.config();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
