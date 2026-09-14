"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    requesterName: "",
    department: "",
    equipment: "",
    description: "",
    priority: "Medium",
    category: "Equipment",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);

    const { data, error } = await supabase
      .from("maintenance_requests")
      .insert([
        {
          requester_name: formData.requesterName,
          department: formData.department,
          equipment: formData.equipment,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error(error);
      alert("There was a problem submitting the request.");
      setSubmitting(false);
      return;
    }

    router.push(`/success?id=${data.id}`);
  }

  const inputStyle =
    "w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900";

  const labelStyle =
    "block font-medium mb-1 text-gray-900";

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Maintenance Request
        </h1>

        <p className="text-gray-700 mb-6">
          Submit a maintenance issue below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className={labelStyle}>
              Requester Name
            </label>

            <input
              type="text"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>
              Department / Location
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>
              Equipment or Item
            </label>

            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>
              Problem Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Emergency">
                Emergency
              </option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Equipment">
                Equipment
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Plumbing">
                Plumbing
              </option>

              <option value="HVAC">
                HVAC
              </option>

              <option value="Building">
                Building
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-500"
          >
            {submitting
              ? "Submitting..."
              : "Submit Request"}
          </button>

        </form>

      </div>
    </main>
  );
}