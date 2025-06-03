// Example for budgets.js (Mongoose model if using Mongoose)
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  budget: { type: Number, required: true },
});

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
