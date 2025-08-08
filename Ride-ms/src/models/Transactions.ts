import mongoose, { Model, Schema } from "mongoose";
import { TransactionI } from "../utils/interface";

const transactionSchema = new Schema<TransactionI>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    tx_type: {
      type: String,
      enum: ["deposit", "withdrawal", "earn"]
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["success", "pending", "failed"]
    },
    ref_id: { type: String }
  },
  {
    timestamps: true,
  }
);

const Transaction: Model<TransactionI> = mongoose.model<TransactionI>(
  "Transaction",
  transactionSchema
);
export default Transaction;
