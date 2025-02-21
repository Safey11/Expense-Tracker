"use client";
import { useSession, signOut } from "next-auth/react";

export default function Webpage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Webpage</h1>
      <p className="text-lg">Logged in as {session?.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded-lg mt-4"
      >
        Sign Out
      </button>
    </div>
  );
}
