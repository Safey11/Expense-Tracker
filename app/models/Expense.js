import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Default to the current date
});

const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;
