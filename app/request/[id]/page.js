"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function RequestDetails() {
  const params = useParams();
  const id = params.id;

  const [request, setRequest] = useState(null);

  const [formData, setFormData] = useState({
    assigned_to: "",
    status: "New",
    date_started: "",
    date_completed: "",
    repair_notes: "",
    cost: "",
  });

  useEffect(() => {
    async function getRequest() {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setRequest(data);

      setFormData({
        assigned_to: data.assigned_to || "",
        status: data.status || "New",
        date_started: data.date_started || "",
        date_completed: data.date_completed || "",
        repair_notes: data.repair_notes || "",
        cost: data.cost || "",
      });
    }

    getRequest();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSave(event) {
    event.preventDefault();

    const { error } = await supabase
      .from("maintenance_requests")
      .update({
        assigned_to: formData.assigned_to,
        status: formData.status,
        date_started: formData.date_started || null,
        date_completed: formData.date_completed || null,
        repair_notes: formData.repair_notes,
        cost: formData.cost === "" ? null : Number(formData.cost),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("There was a problem saving the changes.");
      return;
    }

    alert("Request updated successfully!");
  }

  if (!request) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="max-w-3xl mx-auto">
          <p>Loading request...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 underline mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Maintenance Request #{request.id}
        </h1>

        <p className="text-gray-600 mb-6">
          View and update this maintenance request.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-8 space-y-2">
          <p>
            <strong>Requester:</strong> {request.requester_name}
          </p>

          <p>
            <strong>Location:</strong> {request.department}
          </p>

          <p>
            <strong>Equipment:</strong> {request.equipment}
          </p>

          <p>
            <strong>Problem:</strong> {request.description}
          </p>

          <p>
            <strong>Priority:</strong> {request.priority}
          </p>

          <p>
            <strong>Category:</strong> {request.category}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Assigned To
            </label>

            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            >
              <option value="">Unassigned</option>
              <option value="John">John</option>
              <option value="Mike">Mike</option>
              <option value="Sarah">Sarah</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            >
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Parts">
                Waiting for Parts
              </option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Date Started
            </label>

            <input
              type="date"
              name="date_started"
              value={formData.date_started}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Date Completed
            </label>

            <input
              type="date"
              name="date_completed"
              value={formData.date_completed}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Repair Notes
            </label>

            <textarea
              name="repair_notes"
              value={formData.repair_notes}
              onChange={handleChange}
              rows="4"
              placeholder="Enter repair notes..."
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-900">
              Repair Cost ($)
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Save Changes
          </button>

        </form>
      </div>
    </main>
  );
}