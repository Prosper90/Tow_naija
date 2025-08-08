import { Router } from "express";
import ReviewController from "../controllers/reviewController";

const router = Router();

router.get("/get_driver_reviews/:driverId", ReviewController.GetDriverReviews)
router.get("/get_review/:reviewId", ReviewController.GetReview)
router.post("/add_a_review",  ReviewController.AddAReview);
router.put("/update_a_review", ReviewController.UpdateAReview);

export default router;
