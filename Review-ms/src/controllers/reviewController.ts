import { NextFunction, Request, Response } from "express";
import ReviewRepository from "../repositories/reviewRepository";
import ReviewService from "../services/reviewService";

ReviewService.setRepository(new ReviewRepository());

class AuthController {



  static GetDriverReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {driverId} = req.params;
      const reviews = await ReviewService.getAllReviewsFroDriver(driverId as string);
      res
        .status(200)
        .json({ status: true, data: reviews });
    } catch (error) {
      next(error);
    } 
  };

  static GetReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {reviewId} = req.params;
     const review = await ReviewService.getReviewById(reviewId);
      res
        .status(200)
        .json({ status: true, data: review });
    } catch (error) {
      next(error);
    } 
  };

  static AddAReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { driverId, rate,  comment} = req.body;

      const enteredReview = await ReviewService.makeComment(driverId, rate, comment);
      res
        .status(200)
        .json({
          status: true,
          data: enteredReview
        });
    } catch (error) {
      next(error);
    }
  };



  static UpdateAReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { driverId, rate, comment } = req.body;

      const updateReview = await ReviewService.updateComment(driverId, {rate, comment});

      res
        .status(200)
        .json({
          status: true,
          data: updateReview
        });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
