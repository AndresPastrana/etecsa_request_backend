import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Schema } from "mongoose";
import { RequestStatus } from "../const.js";
import { createDoc } from "../helpers/createDoc.js";
import { calculateTotalImport } from "../helpers/index.js";
import { PiplineEntry, RequestCounter } from "../types.js";
import { UserRole } from "./../const.js";
import { handleResponse } from "./../middleware/index.js";
import { ModelIBilling, ModelRequest, ModelUser } from "./../models/index.js";
import { log } from "node:console";

// Create a new request
const createRequest = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Schema.Types.ObjectId;
    };
  },
  res: Response
) => {
  try {
    const authUser = await ModelUser.findById(req.user?.uid);
    if (!authUser?.departament) {
      return handleResponse({
        res,
        statusCode: 401,
        msg: "Unauthorized",
      });
    }

    const {
      status = RequestStatus.PENDING,
      approvedBy = null,
      departament = null,
      resources,
      destiny,
    } = matchedData(req);
    const newRequest = new ModelRequest({
      departament: authUser.departament,
      resources,
      destiny,
    });

    const result = await newRequest.save();
    const newR = (await result.populate("departament")).populate(
      "resources.product"
    );

    handleResponse({
      statusCode: 201,
      msg: "Request created successfully",
      data: newR,
      res,
    });
  } catch (error) {
    handleResponse({
      statusCode: 500,
      msg: "Internal Server Error",
      error,
      res,
    });
  }
};

// Edit the request
const aproveRequest = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Schema.Types.ObjectId;
    };
  },
  res: Response
) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const requestToAprove = await ModelRequest.findById(id);
    if (requestToAprove && requestToAprove?.resources.length >= 1) {
      const productsWithQuantity = requestToAprove?.resources.map((r) => ({
        productId: r.product,
        quantity: r.quantity,
      }));

      // Calculate total import
      const totalImport = await calculateTotalImport(productsWithQuantity);

      // Crate a new bill
      const requestBill = new ModelIBilling({
        request: id,
        total_import: totalImport,
      });

      requestToAprove.status = RequestStatus.APPROVED;
      requestToAprove.aprovedBy = req.user?.uid;

      const results = await Promise.all([
        requestToAprove.save(),
        requestBill.save(),
      ]);
      const populated = await results[0].populate([
        "aprovedBy",
        "departament",
        "destiny",
      ]);

      return handleResponse({
        res,
        data: populated,
        statusCode: 200,
      });
    }

    return handleResponse({
      res,
      data: id,
      statusCode: 200,
    });
  } catch (error) {}
};

const deniedRequest = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Schema.Types.ObjectId;
    };
  },
  res: Response
) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const requestToAprove = await ModelRequest.findById(id);
    if (requestToAprove) {
      requestToAprove.status = RequestStatus.DENIED;
      requestToAprove.aprovedBy = req.user?.uid;
      const updatedRequest = await requestToAprove.save();

      const populated = await updatedRequest.populate([
        "aprovedBy",
        "departament",
        "destiny",
      ]);
      return handleResponse({
        res,
        data: populated,
        statusCode: 201,
      });
    }
  } catch (error) {
    return handleResponse({
      res,
      error,
      statusCode: 500,
      msg: "Internla server error",
    });
  }
};

const getRequestCountsByStatus = async (req: Request, res: Response) => {
  const pipeline = [
    {
      $match: {
        status: { $in: Object.values(RequestStatus) },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ];
  try {
    // Execute the aggregation pipeline
    const result: Array<PiplineEntry> = await ModelRequest.aggregate(pipeline);

    // Create an object to store the counts
    const counts: RequestCounter = {
      approved: 0,
      denied: 0,
      pending: 0,
    };

    // Update the counts based on the aggregation result
    result.forEach(({ _id, count }: PiplineEntry) => {
      counts[_id] = count;
    });

    handleResponse({
      statusCode: 200,
      msg: "Request counts retrieved successfully",
      data: counts,
      res,
    });
  } catch (error) {
    handleResponse({
      statusCode: 500,
      msg: "Internal Server Error",
      error,
      res,
    });
  }
};

const getAllRequest = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Schema.Types.ObjectId;
    };
  },
  res: Response
) => {
  try {
    // Get the user role and the departament of the user if it has one
    const { status = "all", departament = null } = matchedData(req, {
      locations: ["query"],
    });

    const autUser = await ModelUser.findById(req.user?.uid);
    const isHeadOfDepartment = autUser?.role === UserRole.HEAD_OF_DEPARTMENT;

    const filters = Object({});
    if (status !== "all") {
      Object.assign(filters, { status });
    }

    if (isHeadOfDepartment) {
      Object.assign(filters, { departament: autUser.departament });
    }

    const query = ModelRequest.find({ ...filters })
      .populate("departament", "descripcion")
      .populate("destiny", "description")
      .populate("aprovedBy", "firstName")
      .populate("resources.product", "name");

    const results = await query?.exec();

    return handleResponse({ data: results, statusCode: 200, res });
  } catch (error) {
    console.log(error);

    return handleResponse({
      res,
      error,
      statusCode: 500,
      msg: "Internla server error",
    });
  }
};

const generatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const request = await ModelRequest.findById(id).populate([
      "departament",
      "destiny",
      "aprovedBy",
    ]);

    if (request) {
      // Extract the info to show in the dpf
      // TODO: fix this type error
      const ID = request?.id;
      const status = request?.status;
      const department = request?.departament?.descripcion as string;
      const destiny = request?.destiny?.description as string;
      const aprovedBy = request?.aprovedBy?.firstName;
      const pdfFileName = "request.pdf";
      const doc = await createDoc({
        filename: pdfFileName,
        data: { ID, status, department, destiny, aprovedBy },
      });

      // Set the response headers to send the PDF to the browser
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=example.pdf");

      // Stream the PDF to the client
      doc.pipe(res);

      return;
    }
  } catch (error) {
    return handleResponse({
      res,
      statusCode: 500,
      msg: "Internal Server error",
    });
  }
};

export const RequetsController = {
  getRequestCountsByStatus,
  createRequest,
  getAllRequest,
  generatePdf,
  aproveRequest,
  deniedRequest,
};
