import { Router } from "express";
import { submitContactMessage } from "../controllers/contact.controller";
import { validateContact } from "../middlewares/validation";

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = Router();

router.post("/", validateContact, asyncHandler(submitContactMessage));

export default router;
