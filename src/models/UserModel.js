import { Schema, model, Mongoose } from "mongoose";
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roleId: {
    type: [{ type: Number }],
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});
export const User = model("User", userSchema, "User");
