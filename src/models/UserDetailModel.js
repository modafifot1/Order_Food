import { Schema, model } from "mongoose";
const userDetailSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
  },
});
export const UserDetail = model("UserDetail", userDetailSchema, "UserDetail");
