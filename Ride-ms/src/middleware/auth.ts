import { NextFunction, Request, RequestHandler, Response } from "express";

import config from "../config";
import JWT from "../utils/jwt";
import ErrorResponse from "../utils/errorResponse";
import { JwtPayload } from "jsonwebtoken";
import Driver from "../models/Driver";
import Rider from "../models/Rider";
import { DriverI, RiderI } from "../utils/interface";

const JWTService = new JWT();

const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const headers = req.headers;

  const bearerToken: string = cookies?.Authorization ?? headers?.authorization;
  if (bearerToken) {
    try {
      const [, token] = bearerToken.split(" ");
      if (!token) {
        return next(
          new ErrorResponse(
            "unauthorised access, token reqiured or user not recognized",
            401
          )
        );
      }
      const data: JwtPayload = await JWTService.verifyToken(token);
      if (data) {

          let user;

        // Check if the user is a Driver
        user = await Driver.findById(data.id);

        if (!user) {
             // Check if the user is a Rider
            user = await Rider.findById(data.id);
        }

        if (!user) {
          next(new ErrorResponse("user not found", 404));
        }

        req.user = user;

        next();

      } else {
        next(new ErrorResponse("Invalid token", 404));
      }
    } catch (error) {
      next(error);
    }
  } else {
    next(new ErrorResponse("Token bearer not found", 404));
  }
};

export default authMiddleware;
