"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2, Edit, Check, X, Menu } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar"; // Ensure the correct import path

export default function Expense() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") {
      fetchExpenses();
    }
  }, [status, session]);

  const fetchExpenses = async () => {
    const res = await fetch(`/api/expenses?userEmail=${session?.user?.email}`);
    const data = await res.json();
    setExpenses(data);
  };

  const deleteExpense = async (id) => {
    const res = await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setExpenses(expenses.filter((expense) => expense._id !== id));
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setEditedExpense({ ...expense });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedExpense({});
  };

  const saveEditedExpense = async () => {
    const res = await fetch("/api/expenses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedExpense),
    });

    if (res.ok) {
      const updatedExpenses = expenses.map((expense) =>
        expense._id === editedExpense._id ? editedExpense : expense
      );
      setExpenses(updatedExpenses);
      setEditingId(null);
      setEditedExpense({});
    }
  };

  const handleInputChange = (e, field) => {
    setEditedExpense({ ...editedExpense, [field]: e.target.value });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev); // Toggle function for sidebar

  // ** Export CSV Function**
  const exportCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ** Export Excel Function **
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      (filter === "all" || expense.category === filter) &&
      expense.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 transition-all">
        {/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button onClick={toggleSidebar} className="text-blue-600" aria-label="Open Sidebar">
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-2xl font-bold">Expenses</h1>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Expenses</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Expense List */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-t text-center">
                    <td className="p-3">
                      {editingId === expense._id ? (
                        <select
                          value={editedExpense.category}
                          onChange={(e) => handleInputChange(e, "category")}
                          className="p-2 border rounded"
                        >
                          <option value="Food">Food</option>
                          <option value="Transport">Transport</option>
                          <option value="Bills">Bills</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === expense._id ? (
                        <input
                          type="text"
                          value={editedExpense.name}
                          onChange={(e) => handleInputChange(e, "name")}
                          className="p-2 border rounded"
                        />
                      ) : (
                        expense.name
                      )}
                    </td>
                    <td className="p-3 text-red-600">
                      {editingId === expense._id ? (
                        <input
                          type="number"
                          value={editedExpense.value}
                          onChange={(e) => handleInputChange(e, "value")}
                          className="p-2 border rounded"
                        />
                      ) : (
                        `-$${expense.value}`
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === expense._id ? (
                        <input
                          type="date"
                          value={formatDateForInput(editedExpense.date)}
                          onChange={(e) => handleInputChange(e, "date")}
                          className="p-2 border rounded"
                        />
                      ) : (
                        new Date(expense.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="p-3 flex justify-center gap-4">
                      {editingId === expense._id ? (
                        <>
                          <button
                            onClick={saveEditedExpense}
                            className="text-green-600"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600"
                          >
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(expense)}
                            className="text-blue-600"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense._id)}
                            className="text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    {editingId === expense._id ? (
                      <select
                        value={editedExpense.category}
                        onChange={(e) => handleInputChange(e, "category")}
                        className="p-1 border rounded"
                      >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Bills">Bills</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span>{expense.category}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Name:</span>
                    {editingId === expense._id ? (
                      <input
                        type="text"
                        value={editedExpense.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        className="p-1 border rounded"
                      />
                    ) : (
                      <span>{expense.name}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Amount:</span>
                    {editingId === expense._id ? (
                      <input
                        type="number"
                        value={editedExpense.value}
                        onChange={(e) => handleInputChange(e, "value")}
                        className="p-1 border rounded"
                      />
                    ) : (
                      <span className="text-red-600">-${expense.value}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Date:</span>
                    {editingId === expense._id ? (
                      <input
                        type="date"
                        value={formatDateForInput(editedExpense.date)}
                        onChange={(e) => handleInputChange(e, "date")}
                        className="p-1 border rounded"
                      />
                    ) : (
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingId === expense._id ? (
                      <>
                        <button
                          onClick={saveEditedExpense}
                          className="text-green-600"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(expense)}
                          className="text-blue-600"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense._id)}
                          className="text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button onClick={exportCSV} className="bg-green-600 text-white py-2 px-4 rounded">
            Export CSV
          </button>
          <button onClick={exportExcel} className="bg-blue-600 text-white py-2 px-4 rounded">
            Export Excel
          </button>
        </div>
      </main>
    </div>
  );
}