import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
}, { timestamps: true });

UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);
