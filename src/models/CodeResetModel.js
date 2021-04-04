import { Schema, model } from "mongoose";
const codeSchema = Schema({
  code: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  updateAt: {
    type: Date,
    required: true,
  },
});
export const CodeReset = model("CodeReset", codeSchema, "CodeReset");
