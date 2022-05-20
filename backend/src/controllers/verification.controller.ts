import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sse } from "../app";
import { Worker } from "worker_threads";

const writeEvent = (
  res: Response,
  sseId: string,
  data: string,
  event: string
) => {
  sleep(1000);
  res.write(`id: ${sseId}\n`);
  res.write(`event: ${event}\n`);
  res.write(`data: ${data}\n\n`);
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const sendEvent = (req: Request, res: Response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
};

const verification = async (req: Request, res: Response) => {
  console.log("FILE VERIFICATION IN PROGRESS");
  const worker = new Worker("./build/controllers/worker.js", {
    workerData: {
      path: "./worker.ts",
      filePath: req.params.file,
    },
  });

  worker.on("message", (data) => {
    sse.send(data, "verification");
  });

  worker.on("error", (err) => {
    console.log("Error: ", err);
  });
};

export default verification;
