import { UserRole } from "./../const.js";
// CRUD de HEAD of departament
// Just an Specailist can inserT a head of departament user
// Solamente un especialista puede obtener la lista de heads de departamentos

import { hashString } from "../helpers/index.js";
import { handleResponse } from "../middleware/index.js";
import { ModelUser } from "../models/index.js";

import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Types } from "mongoose";
// Create a new User
const createUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      email,
      role,
      firstName,
      lastName,
      departament,
    } = matchedData(req);

    const existUser = await ModelUser.findOne({
      $or: [{ username }, { email }, { departament }],
    });

    if (existUser) {
      return handleResponse({
        res,
        statusCode: 400,
        msg: "username, email and departament must be unique",
        error: true,
      });
    }
    const hashedPassword = await hashString(password);
    const newUser = await ModelUser.create({
      username,
      password: hashedPassword,
      email,
      role,
      firstName,
      lastName,
      departament,
    });
    const populated = await newUser.populate('departament')

    handleResponse({
      statusCode: 201,
      msg: "User created successfully",
      data: populated,
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

// Get all Users by Role
const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = matchedData(req, { locations: ["query"] });

    const query = ModelUser.find({ role });
    const usersByRole = await query.populate('departament')

    if (!usersByRole || usersByRole.length === 0) {
      return handleResponse({
        statusCode: 404,
        msg: "No users found for the specified role",
        res,
      });
    }

    handleResponse({
      statusCode: 200,
      msg: "Users retrieved successfully by role",
      data: usersByRole,
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

const getUserById = async (
  req: Request & {
    user?: {
      role: UserRole;
      uid: Types.ObjectId | string;
    };
  },
  res: Response
) => {
  // Get a User by ID
  // Un specailist puede obtener la informacion de un head de departament
  // un head of departament puede obtener solo su informacion

  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const authUser = req.user;
    const isSpecialts = authUser?.role === UserRole.SPECIALIST;

    let filter = {};

    if (isSpecialts) {
      filter = { _id: id, role: UserRole.HEAD_OF_DEPARTMENT };
    }

    if (!isSpecialts && authUser?.uid === id) {
      filter = { _id: id, role: UserRole.HEAD_OF_DEPARTMENT };
    } else if (!isSpecialts && !(authUser?.uid === id)) {
      return handleResponse({
        res,
        statusCode: 401,
        msg: "You cant access this user info",
      });
    }

    const user = await ModelUser.find(filter);

    if (!user) {
      return handleResponse({
        res,
        statusCode: 404,
        msg: "User not found",
      });
    }

    handleResponse({
      statusCode: 200,
      msg: "User retrieved successfully",
      data: user,
      res,
    });
  } catch (error) {
    // Handle any errors that occur during retrieval
    handleResponse({
      statusCode: 500,
      msg: "Internal Server Error",
      error,
      res,
    });
  }
};

// Update a User by ID
const updateUserById = async (req: Request, res: Response) => {
  try {
    const {
      id,
      username,
      password = null, // we do this  to avoid updating the password
      role,
      email,
      firstName,
      lastName,
      departament,
    } = matchedData(req, { locations: ["params", "body"] });

    const existUser = await ModelUser.findOne({
      $and: [{ $or: [{ username }, { departament }, { email }] }, { _id: { $ne: id } }],
    })
    console.log(existUser);

    if (existUser) {
      return handleResponse({
        res,
        error: true,
        statusCode: 400,
        msg: "email and departament must be unique",
      });
    }
    const updatedUser = await ModelUser.findByIdAndUpdate(
      id,
      {
        email, firstName, lastName, departament, role, username,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return handleResponse({
        statusCode: 404,
        msg: "User not found",
        res,
      });
    }

    const populated = await updatedUser.populate('departament')
    console.log(populated);

    handleResponse({
      statusCode: 200,
      msg: "User updated successfully",
      data: populated,
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

// Delete a User by ID
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await ModelUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return handleResponse({
        statusCode: 404,
        msg: "User not found",
        res,
      });
    }


    handleResponse({
      statusCode: 200,
      msg: "User deleted successfully",
      data: id,
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

// This controller has development purposes
// Get all Users
//  const getAllUsers = async (req: Request, res: Response) => {
// 	try {
// 		// Fetch all User documents from the database
// 		const allUsers = await ModelUser.find();

// 		// Use the "handleResponse" function to handle the response
// 		handleResponse({
// 			statusCode: 200,
// 			msg: "All User documents retrieved successfully",
// 			data: allUsers,
// 			res,
// 		});
// 	} catch (error) {
// 		// Handle any errors that occur during retrieval
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error: error.message,
// 			res,
// 		});
// 	}
// };

export const UserController = {
  createUser,
  getUserById,
  getUsersByRole,
  updateUserById,
  deleteUserById,
};
