import { NextResponse } from "next/server";
import connectDB from "../../lib/database"; // Adjust the import path as needed
import Expense from "../../models/Expense"; // Adjust the import path as needed

// GET: Fetch all expenses for a specific user
export async function GET(req) {
  try {
    await connectDB(); // Connect to the database

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    // Validate userEmail
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch expenses for the user, sorted by createdAt in descending order
    const expenses = await Expense.find({ userEmail }).sort({ createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST: Add a new expense
export async function POST(req) {
  try {
    await connectDB(); // Connect to the database

    // Parse the request body
    const { userEmail, name, value, category, date } = await req.json();

    // Validate required fields
    if (!userEmail || !name || !value || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use the provided date or default to the current date
    const expenseDate = date ? new Date(date) : new Date();

    // Create and save the new expense
    const newExpense = new Expense({ userEmail, name, value, category, date: expenseDate });
    await newExpense.save();

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
  }
}

// PUT: Update an existing expense
export async function PUT(req) {
  try {
    await connectDB(); // Connect to the database

    // Parse the request body
    const { _id, userEmail, name, value, category } = await req.json();

    // Validate required fields
    if (!_id || !userEmail || !name || !value || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find and update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      _id,
      { userEmail, name, value, category },
      { new: true } // Return the updated document
    );

    // If expense not found
    if (!updatedExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Return the updated expense
    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an expense by ID
export async function DELETE(req) {
  try {
    await connectDB(); // Connect to the database

    // Parse the request body
    const { id } = await req.json();

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "Missing expense ID" }, { status: 400 });
    }

    // Delete the expense
    await Expense.findByIdAndDelete(id);

    // Return success message
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}