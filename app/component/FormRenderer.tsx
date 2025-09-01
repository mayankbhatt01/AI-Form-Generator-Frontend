"use client";

import { useState } from "react";

export default function FormRenderer({
  loading = false,
  schema,
  onSubmit,
}: {
  loading?: boolean;
  schema: any;
  onSubmit?: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      if (files) {
        // ✅ handle single or multiple files
        setFormData({
          ...formData,
          [name]: files.length > 1 ? Array.from(files) : files[0],
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]: any) => {
      if (Array.isArray(value)) {
        value.forEach((file, idx) => {
          data.append(`${key}[${idx}]`, file); // ✅ multiple files
        });
      } else {
        data.append(key, value);
      }
    });

    if (onSubmit) onSubmit(data);
  };  

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-black p-6 rounded-2xl shadow-md"
    >
      {schema.fields.map((field: any, idx: number) => (
        <div key={idx} className="flex flex-col">
          <label className="mb-1 font-medium">{field.label}</label>
          <input
            type={field.type}
            name={field.id}
            placeholder={field.placeholder || ""}
            required={field.required || false}
            onChange={handleChange}
            multiple={field.type === "file"} // ✅ allow multiple if file
            className="border p-2 rounded"
          />
        </div>
      ))}

      <button
        // disabled={loading}
        type="submit"
        className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submiting..." : "Submit"}
      </button>
    </form>
  );
}
