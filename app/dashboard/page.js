"use client"; // Mark this as a Client Component
import { useState, useEffect } from "react"; // Import useState
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Menu, X, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Define isSidebarOpen state
  const [expensesData, setExpensesData] = useState([]);
  const userEmail = session?.user?.email || "guest";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses?userEmail=${userEmail}`);
        const data = await res.json();
        setExpensesData(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (status === "authenticated") fetchExpenses();
  }, [status, userEmail]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev); // Toggle function for sidebar

  const deleteExpense = async (id) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setExpensesData((prev) => prev.filter((expense) => expense._id !== id));
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.value, 0);
  const monthlyExpenses = totalExpenses * 0.25; // Example calculation
  const remainingBudget = 2000 - totalExpenses; // Example budget

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
     <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all">
        {/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button onClick={toggleSidebar} className="text-blue-600" aria-label="Open Sidebar">
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {session?.user?.name || "User"}!
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[
            { title: "Total Expenses", value: `$${totalExpenses.toFixed(2)}`, color: "text-red-600" },
            { title: "This Month", value: `$${monthlyExpenses.toFixed(2)}`, color: "text-blue-600" },
            { title: "Remaining Budget", value: `$${remainingBudget.toFixed(2)}`, color: "text-green-600" },
          ].map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Expense Breakdown</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
            <PieChart>
            <Pie
              data={expensesData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label // Remove this if you don't need labels, or add a function/boolean value
            >
              {expensesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 bg-white rounded-lg shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expensesData.length > 0 ? (
                  expensesData.map((expense) => (
                    <tr key={expense._id} className="border-t">
                      <td className="p-3">{expense.name}</td>
                      <td className="p-3 text-red-600">-${expense.value.toFixed(2)}</td>
                      <td className="p-3">
                        <button onClick={() => deleteExpense(expense._id)} className="text-red-600">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}