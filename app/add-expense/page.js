"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AddExpense() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to add an expense.");
      return;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userEmail: session.user.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add expense.");
      }

      router.push("/dashboard");
    } catch (error) {
      alert(error.message);
      console.error("Error adding expense:", error);
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Expense", path: "/expense" },
    { label: "Add Expense", path: "/add-expense" },
    { label: "Import CSV File", path: "/import-csv" },
    { label: "Report", path: "/report" },
    { label: "Profile - User", path: "/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed md:static w-64 bg-blue-600 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
        <nav className="mt-4">
          <ul className="space-y-3">
            {menuItems.map(({ label, path }, index) => (
              <li key={index}>
                <Link href={path} className="block p-2 hover:bg-blue-700 rounded">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => signOut()}
                className="w-full text-left p-2 hover:bg-blue-700 rounded"
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Add Expense</h1>
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expense Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <input type="hidden" name="date" value={formData.date} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
