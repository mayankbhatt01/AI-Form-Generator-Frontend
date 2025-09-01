"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRenderer from "../../component/FormRenderer";
import axios from "axios";

export default function DynamicFormPage() {
  const params = useParams();
  const formId = params?.id;

  const [schema, setSchema] = useState<any | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const getFormData = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `http://localhost:4000/api/forms/${formId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSchema({ fields: data?.formStructure?.fields });
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        getFormData();
      } catch (err) {
        console.error(err);
      }
    };

    if (formId) fetchForm();
  }, [formId]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true); // ✅ Start loading
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `http://localhost:4000/api/forms/${formId}/submit`,
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

  if (!schema) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {submitted ? (
        <div className="bg-gray-900 text-gray-200 p-6 rounded-xl shadow-md text-center">
          ✅ Thank you! Your response has been submitted.
        </div>
      ) : (
        <FormRenderer schema={schema} onSubmit={handleSubmit} loading={loading} />
      )}
    </div>
  );
}
