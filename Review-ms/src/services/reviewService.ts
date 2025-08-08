import ReviewRepository from "../repositories/reviewRepository";
import ErrorResponse from "../utils/errorResponse";
import { ReviewI } from "../utils/interface";

class ReviewService {
  private static reviewRepository: ReviewRepository;

  // Inject the repository
  static setRepository(repo: ReviewRepository) {
    this.reviewRepository = repo;
  }


  static getReviewById = async (
    reviewId: string,
  ): Promise<ReviewI | null> => {
    try {
      // Validate the input
      if (!reviewId) {
        throw new Error("Invalid input: Driver ID and rate are required, and rate must be between 1 and 5.");
      }

      // Check if a review already exists for the driver
      const existingReview = await this.reviewRepository.findById(reviewId);
      if (!existingReview) {
        throw new ErrorResponse("Review for this driver already exists.", 401);
      }

      // return the reviews
      return existingReview;
    } catch (error) {
      throw error;
    }
  };



  static getAllReviewsFroDriver = async (
    driverId: string,
  ): Promise<ReviewI[] | null> => {
    try {
      // Validate the input
      if (!driverId) {
        throw new Error("Enter driver id");
      }

      // Check if a review already exists for the driver
      const existingReviews = await this.reviewRepository.findMultipleByField('driverId', driverId);
      if (!existingReviews) {
        throw new Error("Review for this driver not found.");
      }

      // return the reviews
      return existingReviews;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Creates a new comment for a driver with a given rating.
   * @param driverId - ID of the driver.
   * @param rate - Rating value.
   * @param comment - Optional comment string.
   * @returns The newly created review or an error.
   */
  static makeComment = async (
    driverId: string,
    rate: number,
    comment?: string
  ): Promise<ReviewI | null> => {
    try {
      // Validate the input
      if (!driverId || rate < 1 || rate > 5) {
        throw new Error("Invalid input: Driver ID and rate are required, and rate must be between 1 and 5.");
      }

      // Check if a review already exists for the driver
      // const existingReview = await this.reviewRepository.findOneByField({ driverId });
      // if (existingReview) {
      //   throw new ErrorResponse("Review for this driver already exists.", 401);
      // }

      // Create a new review
      const newReview: Partial<ReviewI> = { driverId, rate, comment };
      return await this.reviewRepository.create(newReview);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Deletes a comment for a driver.
   * @param driverId - ID of the driver.
   * @returns The deleted review or an error if not found.
   */
  static deleteComment = async (driverId: string): Promise<ReviewI | null> => {
    try {
      if (!driverId) {
        throw new Error("Driver ID is required.");
      }

      // Delete the review by driverId
      const deletedReview = await this.reviewRepository.remove("driverId", driverId);
      if (!deletedReview) {
        throw new Error("No review found for the specified driver.");
      }

      return deletedReview;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Updates a driver's rating or comment.
   * @param driverId - ID of the driver.
   * @param options - Partial fields to update (rate or comment).
   * @returns The updated review or an error if not found.
   */
  static updateComment = async (
    driverId: string,
    options: Partial<ReviewI>
  ): Promise<ReviewI | null> => {
    try {
      if (!driverId || (!options.rate && !options.comment)) {
        throw new Error("Driver ID and at least one field (rate or comment) to update are required.");
      }

      // Ensure the rate is within the acceptable range if provided
      if (options.rate && (options.rate < 1 || options.rate > 5)) {
        throw new ErrorResponse("Rate must be between 1 and 5.", 401);
      }

      // Update the review
      const updatedReview = await this.reviewRepository.update(
        "driverId",
        driverId,
        options
      );
      if (!updatedReview) {
        throw new Error("No review found for the specified driver.");
      }

      return updatedReview;
    } catch (error) {
      throw error;
    }
  };
}

export default ReviewService;