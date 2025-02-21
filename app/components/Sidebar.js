"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { X } from "lucide-react";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <aside
      className={`fixed md:static w-64 bg-blue-600 text-white min-h-screen p-6 transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-64"
      } md:translate-x-0 z-50`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
        <button onClick={toggleSidebar} className="md:hidden text-white" aria-label="Close Sidebar">
          <X size={28} />
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-3">
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Expense", path: "/expense" },
            { label: "Add Expense", path: "/add-expense" },
            { label: "Import CSV File", path: "/import-csv" },
            { label: "Report", path: "/report" },
            { label: "Profile - User", path: "/profile" },
          ].map((item, index) => (
            <li key={index}>
              <Link href={item.path} className="block p-2 hover:bg-blue-700 rounded">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={signOut} className="w-full text-left p-2 hover:bg-blue-700 rounded">
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}