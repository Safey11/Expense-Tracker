// app/api/budget/[userEmail]/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database'; // your MongoDB connection file
import Budget from '../../../models/budgets'; // path to your budget model

export async function GET(request, { params }) {
  await connectDB();
  const userEmail = params.userEmail;

  const existingBudget = await Budget.findOne({ userEmail });
  return NextResponse.json(existingBudget || { budget: 2000 }); // fallback
}

export async function POST(request, { params }) {
  await connectDB();
  const userEmail = params.userEmail;
  const { budget } = await request.json();

  const updated = await Budget.findOneAndUpdate(
    { userEmail },
    { $set: { budget } },
    { upsert: true, new: true }
  );

  return NextResponse.json(updated);
}
