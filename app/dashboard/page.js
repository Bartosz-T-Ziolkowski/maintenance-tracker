"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests();
  }, []);

  async function getRequests() {
    const { data, error } = await supabase
      .from("maintenance_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRequests(data);
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from("maintenance_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("There was a problem updating the status.");
      return;
    }

    setRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );
  }

  async function updateAssignedTo(id, assignedTo) {
    const { error } = await supabase
      .from("maintenance_requests")
      .update({ assigned_to: assignedTo })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("There was a problem assigning the request.");
      return;
    }

    setRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, assigned_to: assignedTo }
          : request
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Maintenance Dashboard
        </h1>

        <p className="text-gray-700 mb-6">
          View and manage maintenance requests.
        </p>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-gray-900">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Equipment</th>
                <th className="text-left p-4">Problem</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Assigned To</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t"
                >

                  <td className="p-4">
                    <Link
                      href={`/request/${request.id}`}
                      className="text-blue-600 underline font-medium"
                    >
                      #{request.id}
                    </Link>
                  </td>

                  <td className="p-4">
                    {request.requester_name}
                  </td>

                  <td className="p-4">
                    {request.department}
                  </td>

                  <td className="p-4">
                    {request.equipment}
                  </td>

                  <td className="p-4">
                    {request.description}
                  </td>

                  <td className="p-4">
                    {request.priority}
                  </td>

                  <td className="p-4">
                    {request.category}
                  </td>

                  <td className="p-4">
                    <select
                      value={request.assigned_to || ""}
                      onChange={(event) =>
                        updateAssignedTo(
                          request.id,
                          event.target.value
                        )
                      }
                      className="border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
                    >
                      <option value="">Unassigned</option>
                      <option value="John">John</option>
                      <option value="Mike">Mike</option>
                      <option value="Sarah">Sarah</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <select
                      value={request.status}
                      onChange={(event) =>
                        updateStatus(
                          request.id,
                          event.target.value
                        )
                      }
                      className="border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
                    >
                      <option>New</option>
                      <option>Assigned</option>
                      <option>In Progress</option>
                      <option>Waiting for Parts</option>
                      <option>Completed</option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}