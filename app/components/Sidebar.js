"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { X, LogOut, FileText, User, PlusCircle, PieChart, Home } from "lucide-react";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const pathname = usePathname();

const navItems = [
  // 🌟 Main
  { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { label: "Expense", path: "/expense", icon: <PieChart size={18} /> },
  { label: "Add Expense", path: "/add-expense", icon: <PlusCircle size={18} /> },
  { label: "Import CSV File", path: "/import-csv", icon: <FileText size={18} /> },

  // 🧾 Reports
  { label: "Reports", path: "/report", icon: <FileText size={18} /> },

  // 👤 Account & Sharing
  { label: "Profile - User", path: "/profile", icon: <User size={18} /> },

];


  return (
    <aside
      className={`fixed top-0 left-0 md:static w-64 bg-blue-600 text-white min-h-screen p-6 transition-transform transform duration-300 z-50 shadow-lg ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide">Expense Tracker</h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white hover:text-red-300 transition"
          aria-label="Close Sidebar"
        >
          <X size={28} />
        </button>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  pathname === item.path
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-blue-500 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-4 border-t border-blue-500 mt-4">
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-red-600 transition-all"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
