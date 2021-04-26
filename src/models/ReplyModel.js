import { Schema, model } from "mongoose";
const replySchema = Schema({
  feedbackId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  use,
});
