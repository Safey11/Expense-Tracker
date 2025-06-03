"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Menu, X, Trash2, Pencil } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [budget, setBudget] = useState(2000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toggleSidebar = () => {
   setIsSidebarOpen((prev) => !prev);
  };
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6666"];

 useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
    return;
  }

  
  
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return;
      
      const [expensesRes, budgetRes] = await Promise.all([
        fetch(`/api/expenses?userEmail=${userEmail}`),
        fetch(`/api/budget/${userEmail}`),
      ]);
      
      const [expenses, budgetData] = await Promise.all([
        expensesRes.json(),
        budgetRes.json(),
      ]);
      
      setExpensesData(expenses);
      setBudget(budgetData?.budget || 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };
  
  if (status === "authenticated" && session?.user?.email) {
    fetchData();
  }
}, [status, session, router]);


const totalExpenses = expensesData.reduce(
    (sum, expense) => sum + (expense.value || 0),
    0
  );
  const monthlyExpenses = totalExpenses * 0.25;
  const remainingBudget =
    !isNaN(budget) && !isNaN(totalExpenses) ? budget - totalExpenses : 0;
const handleBudgetUpdate = async () => {
  const parsedBudget = parseFloat(newBudget);
  if (!isNaN(parsedBudget) && parsedBudget >= 0 && session?.user?.email) {
    try {
      const res = await fetch(`/api/budget/${session.user.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: parsedBudget }),
      });

      if (res.ok) {
        const data = await res.json();
        setBudget(data.budget);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  }
};



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 p-6 transition-all">
        {/* Mobile Topbar */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="text-blue-600"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* Welcome */}
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {session?.user?.name || "User"}!
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">This Month</h2>
            <p className="text-2xl font-bold text-blue-600">
              ${monthlyExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
            <h2 className="text-lg font-semibold">Remaining Budget</h2>
            <p className="text-2xl font-bold text-green-600">
              ${!isNaN(remainingBudget) ? remainingBudget.toFixed(2) : "0.00"}
            </p>

            <button
              onClick={() => {
                setNewBudget(budget);
                setIsModalOpen(true);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
              aria-label="Edit Budget"
            >
              <Pencil size={20} />
            </button>
          </div>
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
                  label
                >
                  {expensesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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

          {loading ? (
            <p className="mt-4 text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-center text-red-500">{error}</p>
          ) : (
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
                        <td className="p-3 text-red-600">
                          -${(expense.value || 0).toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteExpense(expense._id)}
                            className="text-red-600"
                            aria-label="Delete Expense"
                          >
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
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-4">Set New Monthly Budget</h2>
              <input
                type="number"
                value={newBudget}
                min={0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewBudget(!isNaN(val) ? val : 0);
                }}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBudgetUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
