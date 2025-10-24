import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  role: {
    type: String,
    enum: ["assistant", "user"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timespan: {
    type: Date,
    default: Date.now,
  },
});

const threadSchema = new Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    default: "New Chat",
    required: true,
  },
  message: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Thread", threadSchema);
