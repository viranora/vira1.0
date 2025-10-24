const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Genel' },
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
