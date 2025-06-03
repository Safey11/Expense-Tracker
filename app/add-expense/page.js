"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Trash2, Edit, Check, X, Menu } from "lucide-react";


export default function AddExpense() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle

  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
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

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev); // Toggle function for sidebar


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
      <div className="md:hidden fixed top-4 left-4 z-50">
  <button onClick={toggleSidebar} className="text-blue-600" aria-label="Open Sidebar">
    {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
     </div>
  
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Expense</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        </div>
      </div>
    </div>
  );
}
