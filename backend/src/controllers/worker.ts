import { parentPort, workerData } from "worker_threads";
import xlsx from "node-xlsx";
import fs = require("fs");
import path = require("path");

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

let progress: number = 0;
let filePath = path.resolve("public/docs");

fs.readdir(filePath, async (err, files) => {
  if (err) {
    console.log(err);
  }
  const workSheetsFromFile = await xlsx.parse(
    `${filePath}/${workerData.filePath}`
  );

  workSheetsFromFile.forEach((file) => {
    const correctData = file.data.slice(1, file.data.length - 1);
    correctData.forEach(async (entry, idx) => {
      await phoneNumberVerification((entry as string[])[0]);
      progress = Math.floor((idx / (correctData.length - 1)) * 100);
      parentPort?.postMessage(progress);
      // console.log("Progress: ", progress);
    });
    console.log("FILE VERIFICATION COMPLETED");
  });
});
