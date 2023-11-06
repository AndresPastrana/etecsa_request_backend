import { Router } from "express";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { UserRole } from "../const.js";
import { BillController } from "../controllers/bills.js";

export const router = Router();

const authValidations = [isValidToken];

// get all bills : only an specialist
router.get(
  "/all",
  [...authValidations, protectRouteByRole([UserRole.SPECIALIST])],
  BillController.getAllBills
);

router.get(
  "/by-departament",
  [...authValidations, protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT])],
  BillController.getDepartamentBills
);

// get all bills from a departament
