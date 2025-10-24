import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Your username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Your email address is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread", // ✅ uppercase to match model name
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

export default mongoose.model("User", userSchema);
