"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";

export default function SubmissionsPage() {
  const params = useParams();
  const formId = params?.id;

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:4000/api/forms/${formId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) getSubmissions();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="animate-pulse text-lg font-semibold text-gray-200">
          Loading submissions...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-black min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-8 text-center text-white"
      >
        📋 Form Submissions
      </motion.h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-400">No submissions yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((sub, idx) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-gray-100">
                    Submission #{idx + 1}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(sub.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Answers */}
              {sub.answers && Object.keys(sub.answers).length > 0 ? (
                <div className="bg-gray-800 rounded-xl p-3 space-y-2 mb-3 border border-gray-700">
                  {Object.entries(sub.answers).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm border-b border-gray-700 last:border-none pb-1"
                    >
                      <span className="font-medium text-gray-300">{key}</span>
                      <span className="text-gray-100">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500 text-sm mb-3">
                  No answers provided.
                </p>
              )}

              {/* Files */}
              {sub.files && sub.files.length > 0 && (
                <div>
                  <p className="font-medium text-gray-200 mb-2">Uploaded Files:</p>
                  <div className="flex flex-wrap gap-3">
                    {sub.files.map((file: any) => (
                      <a
                        key={file._id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={file.url}
                          alt="Uploaded file"
                          className="w-24 h-24 object-cover rounded-xl border border-gray-700 shadow-md hover:scale-105 transition-transform duration-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
