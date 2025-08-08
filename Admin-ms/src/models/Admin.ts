import mongoose, { Model, Schema } from "mongoose";
import { AdminI } from "../utils/interface";

const adminSchema = new Schema<AdminI>(
  {
    email: { type: String },
    role: {type: String, enum: ["SuperAdmin", "admin"], default: "admin" },
    password: { type: String}
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: false } // Change this to false
  },

);

const Admin: Model<AdminI> = mongoose.model<AdminI>("Admin", adminSchema);
export default Admin;
