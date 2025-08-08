import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Logger from "./log";

const ErroHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  error.message = err.message || "Something went wrong";

  // Duplicate error
  if (err.code === 11000) {
    const message = "Already registered";
    error = new ErrorResponse(message, 404);
  }

  // Mongo bad ObjectId error
  if (err.name === "CastError") {
    const message = "Invalid id, CastError From MongoDb";
    error = new ErrorResponse(message, 404);
  }

  if (err instanceof ReferenceError) {
    const errorMessage = err.message;
    error = new ErrorResponse(errorMessage, 404);
  }

  if (err instanceof TypeError) {
    const errorMessage = err.message;
    error = new ErrorResponse(errorMessage, 404);
  }

  // Mongo validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 404);
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    const getErrMessage: { [key: string]: string } = {};
    Object.values(err.errors).forEach(({ properties }: any) => {
      if (properties.path) {
        getErrMessage[properties.path] = properties.message;
      }
    });

    const errorMessage = Object.values(getErrMessage).join(", ");
    error = new ErrorResponse(errorMessage, 404);
  }

  // Handle MongoDB duplicate key error (E11000)
  if (err.name === "MongoError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field}. The value '${value}' already exists.`;
    error = new ErrorResponse(message, 409); // 409 Conflict is appropriate for duplicate key errors
  }

  // Handle other general errors
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  if (statusCode >= 500 || err) {
    Logger.logger.error(message);
  }
  res.status(statusCode).json({ status: false, message });
};

export default ErroHandler;
