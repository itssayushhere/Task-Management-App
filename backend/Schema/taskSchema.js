import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },
  assignedUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  taskType: {
    type: String,
    enum: ["Personal", "Team"],
    required: true,
  },
}, { timestamps: true });

taskSchema.index({ assignedUser: 1 });

export default mongoose.model("Task", taskSchema);
