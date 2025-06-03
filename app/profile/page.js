"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;
  if (!session) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 shadow-md bg-white">
        <Sidebar />
      </div>

      {/* Profile Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl border border-blue-100 transition-all duration-300">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4 text-center">
            Welcome, {session.user?.name?.split(" ")[0]}!
          </h1>

          <div className="mt-6 space-y-4 text-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Full Name</h2>
              <p className="text-gray-900 text-base">{session.user?.name}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">Email Address</h2>
              <p className="text-gray-900 text-base">{session.user?.email}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => signOut()}
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transform transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
