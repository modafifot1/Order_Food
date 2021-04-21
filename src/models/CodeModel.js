import { Schema, model } from "mongoose";
const codeSchema = Schema({
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  updateAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
export const Code = model("Code", codeSchema, "Code");
