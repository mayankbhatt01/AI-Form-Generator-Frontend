"use client";

import { useState } from "react";
import FormRenderer from "../component/FormRenderer";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function FormGeneratorPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formId,setFormId] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 🔹 Backend call (Gemini trigger)
      const token = localStorage.getItem("token")
      const { data } = await axios.post("https://ai-form-generator-backend.onrender.com/api/forms/generate", { prompt }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormId(data.shareId);
      setSchema(data.formStructure);
    } catch (err) {
      console.error("Error generating form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true); // ✅ Start loading
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `https://ai-form-generator-backend.onrender.com/api/forms/${formId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.message) {
        setSubmitted(true);
      } else {
        alert(data?.message || "Submission saved.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "❌ Something Went Wrong.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-start w-full justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">
          AI Form Generator
        </h1>
        <button
          onClick={() => router.push(`/`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Dashboard
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border p-3 rounded h-28 text-black"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Form"}
        </button>
      </div>
      {schema && (
        <div className="mt-8 bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h2 className="text-xl font-semibold text-black mb-4">Generated Form</h2>
          <div className="max-w-2xl mx-auto py-10 px-4">
            {submitted ? (
              <div className="bg-gray-900 text-gray-200 p-6 rounded-xl shadow-md text-center">
                ✅ Thank you! Your response has been submitted.
              </div>
            ) : (
              <FormRenderer schema={schema} onSubmit={handleSubmit} loading={loading} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
