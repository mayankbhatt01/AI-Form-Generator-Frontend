"use client";

import { useEffect, useState } from "react";
//import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Copy } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get('http://localhost:4000/api/forms/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('Repsonse', data)
        setForms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-start w-full justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">
          Your Dashboard
        </h1>
        <button
          onClick={() => router.push(`/formGenerater`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create Form
        </button>
      </div>

      {forms.length === 0 ? (
        <p className="text-gray-500">No forms created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {form.title}
                </h2>
                <Copy className="text-black"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/form/${form.shareId}`
                    );
                    alert("Copied To Clipboard");
                  }}
                />
              </div>
              <p className="text-gray-600">
                Submissions:{" "}
                <span className="font-bold text-blue-600">
                  {form.submissions}
                </span>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push(`/form/${form.shareId}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  View Form
                </button>
                <button
                  onClick={() => router.push(`/form/${form._id}/submission`)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
