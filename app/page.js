"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [formData, setFormData] = useState({
    requesterName: "",
    department: "",
    equipment: "",
    description: "",
    priority: "Medium",
    category: "Equipment",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
  event.preventDefault();

  const { error } = await supabase
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
    ]);

  if (error) {
    console.error(error);
    alert("There was a problem submitting the request.");
    return;
  }

  alert("Maintenance request submitted!");

  setFormData({
    requesterName: "",
    department: "",
    equipment: "",
    description: "",
    priority: "Medium",
    category: "Equipment",
  });
}

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          Maintenance Request
        </h1>

        <p className="text-gray-600 mb-6">
          Submit a maintenance issue below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium mb-1">
              Requester Name
            </label>

            <input
              type="text"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Department / Location
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Equipment or Item
            </label>

            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Problem Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Emergency</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option>Equipment</option>
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>HVAC</option>
              <option>Building</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold"
          >
            Submit Request
          </button>

        </form>
      </div>
    </main>
  );
}