import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadProfileImage } from "../controllers/upload.controller";
import auth from "../middlewares/auth";

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = Router();

router.post(
  "/profile-image",
  auth,
  upload.single("image"),
  asyncHandler(
    async (
      req: import("express").Request,
      res: import("express").Response,
      next: import("express").NextFunction
    ) => {
      await uploadProfileImage(req, res, next);
      return;
    }
  )
);

export default router;
