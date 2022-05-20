import multer, { FileFilterCallback } from "multer";
import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import axios from "axios";

type DesinationCallBack = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

const multerStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DesinationCallBack
  ): void => {
    cb(null, "public/docs");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FilenameCallback
  ): void => {
    cb(null, file.originalname);
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel.sheet.binary.macroEnabled.12" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/vnd.ms-excel.sheet.macroEnabled.12"
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an Excel file, Please upload only excel files! ", 400)
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFile = upload.single("file");

export const upoadResponse = (req: Request, res: Response) => {
  // console.log("uploaded file", req.file);

  if (res.statusCode === 200) {
    axios.get(
      `http://localhost:5000/api/verify/phone-numbers/${req.file?.originalname}`
    );
  }
  res.status(200).json({
    status: "success",
    message: "Uploaded successful",
    filename: req.file?.originalname,
  });
};
