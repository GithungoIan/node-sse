import { Request, Response } from "express";
import xlsx from "node-xlsx";
import fs = require("fs");
import path = require("path");
import { v4 as uuidv4 } from "uuid";
import { sse } from "../app";

const phoneNumberVerification = async (phoneNumber: string) => {
  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.replace("^\\+", "");
  }
  if (phoneNumber.match("^2547\\d{8}$") || phoneNumber.match("2541\\d{8}$")) {
    return phoneNumber;
  }

  if (phoneNumber.match("^07\\d{8}$") || phoneNumber.match("^01\\d{8}$")) {
    return phoneNumber.replace("/^./g", "254");
  }

  if (phoneNumber.match("^7\\d{8}$") || phoneNumber.match("^1\\d{8}$")) {
    return `254${phoneNumber}`;
  }
  return `Invalid Phone Number ${phoneNumber}`;
};

const writeEvent = (
  res: Response,
  sseId: string,
  data: string,
  event: string
) => {
  console.log("Write Event DATA: ", data);
  console.log("Write Event SSEID: ", sseId);
  res.write(`id: ${sseId}\n`);
  res.write(`event: ${event}\n`);
  res.write(`data: ${data}\n\n`);
};

const snedEvent = (req: Request, res: Response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
};

const verification = async (req: Request, res: Response) => {
  console.log("verfification: ", req.file);
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  let filePath = path.resolve("public/docs/");
  let progress: number = 0;
  let event = "verification";
  const sseId = uuidv4().toString();
  console.log(filePath);
  console.log("FILE VERIFICATION IN PROGRESS");
  fs.readdir(filePath, async (err, files) => {
    if (err) {
      console.log(err);
    }
    const workSheetsFromFile = await xlsx.parse(`${filePath}/${files[0]}`);

    workSheetsFromFile.forEach((file) => {
      const correctData = file.data.slice(1, file.data.length - 1);
      console.log("Length or correct Data: ", correctData.length);
      console.log("Length of actual data: ", file.data.length);

      correctData.forEach(async (entry, idx) => {
        await phoneNumberVerification((entry as string[])[0]);
        progress = Math.floor((idx / (correctData.length - 1)) * 100);
        // setTimeout(

        sse.send(idx, "verification");
        // writeEvent(res, sseId, progress.toString(), event),
        //   100
        // );
        console.log("Progress: ", progress);
      });

      console.log("FILE VERIFICATION COMPLETED");
    });

    // res.status(200).send("FIle Verification Complete");
  });
};

export default verification;
