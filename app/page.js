"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to My App 🚀</h1>
        <p className="text-gray-600 text-lg mb-6">The best platform to manage your tasks and workflow efficiently.</p>

        {session ? (
          <Link
            href="/dashboard"
            className="block w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="block w-full px-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block w-full px-5 py-3 mt-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
