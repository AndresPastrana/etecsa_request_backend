import { Request, Response } from "express";
import { ModelIBilling } from "../models/Billing.js";
import { handleResponse } from "../middleware/handleResponse.js";
import { UserRole } from "../const.js";
import { Model, Schema, Types } from "mongoose";
import { ModelUser } from "../models/User.js";
import { ModelRequest } from "../models/Request.js";

const getAllBills = async (req: Request, res: Response) => {
  try {
    const bills = await ModelIBilling.find({}).populate("request", "resources");

    return handleResponse({
      res,
      data: bills,
      statusCode: 200,
    });
  } catch (error) {
    return handleResponse({
      res,
      statusCode: 500,
      error,
    });
  }
};

const getDepartamentBills = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Schema.Types.ObjectId;
    };
  },
  res: Response
) => {
  const userInfo = await ModelUser.findById(req.user?.uid);
  const requests = await ModelRequest.find({
    departament: userInfo?.departament,
  });

  const mapedRequest: Schema.Types.ObjectId[] = requests.map(
    (request) => request._id
  );

  const bills = await ModelIBilling.find({
    request: { $in: mapedRequest },
  }).populate("request", "resources");

  return res.json({
    userInfo,
    requests,
    bills,
  });
};

export const BillController = {
  getAllBills,
  getDepartamentBills,
};
