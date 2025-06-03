"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { Menu, X } from "lucide-react";
import Spinner from "../components/Spinner";


export default function Reports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("years");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses?userEmail=${session?.user?.email}`);
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (status === "authenticated") fetchExpenses();
  }, [status, session]);

  const years = [...new Set(expenses.map((e) => new Date(e.date).getFullYear()).filter(year => !isNaN(year)))];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filteredMonths = expenses.filter(
    (e) => selectedYear !== null && !isNaN(new Date(e.date).getTime()) && new Date(e.date).getFullYear() === selectedYear
  );

  const filteredDays = filteredMonths.filter(
    (e) => selectedMonth !== null && new Date(e.date).getMonth() === selectedMonth
  );

  const filteredExpenses = filteredDays.filter(
    (e) => selectedDay !== null && new Date(e.date).getDate() === selectedDay
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
    
  <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="text-blue-600" aria-label="Toggle Sidebar">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      <main className="flex-1 p-6">
<h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">Reports</h1>

        {view === "years" && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {years.length > 0 ? years.map((year) => (
              <div
                key={year}
                onClick={() => { setSelectedYear(year); setView("months"); }}
                className="p-4 bg-white rounded-lg shadow cursor-pointer text-center text-xl font-semibold"
              >
                {year}
              </div>
            )) :   <Spinner />
}
          </div>
        )}

        {view === "months" && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {months.map((month, index) => (
              <div
                key={month}
                onClick={() => { setSelectedMonth(index); setView("days"); }}
                className="p-4 bg-white rounded-lg shadow cursor-pointer text-center text-xl font-semibold"
              >
                {month}
              </div>
            ))}
          </div>
        )}

        {view === "days" && (
          <div className="grid grid-cols-7 gap-4 mt-4">
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                onClick={() => { setSelectedDay(i + 1); setView("report"); }}
                className="p-4 bg-white rounded-lg shadow cursor-pointer text-center text-lg font-semibold"
              >
                Day {i + 1}
              </div>
            ))}
          </div>
        )}

        {view === "report" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">
              Expense Report for {selectedYear ?? "Select Year"},
              {selectedMonth !== null ? ` ${months[selectedMonth]}` : " Select Month"}
              {selectedDay !== null ? ` ${selectedDay}` : " Select Day"}
            </h2>
            {filteredExpenses.length > 0 ? (
              <ul className="mt-4">
                {filteredExpenses.map((expense) => (
                  <li key={expense._id} className="p-2 border-b">
                    {expense.name} - ${isNaN(expense.value) ? "Invalid Amount" : expense.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No expenses recorded.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
