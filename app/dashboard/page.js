"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
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

    getRequests();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Maintenance Dashboard
        </h1>

        <p className="text-gray-700 mb-6">
          View and manage maintenance requests.
        </p>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-gray-900">
            <thead className="bg-gray-200 text-gray-900">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Equipment</th>
                <th className="text-left p-4">Problem</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t text-gray-900"
                >
                  <td className="p-4">{request.id}</td>
                  <td className="p-4">{request.requester_name}</td>
                  <td className="p-4">{request.department}</td>
                  <td className="p-4">{request.equipment}</td>
                  <td className="p-4">{request.description}</td>
                  <td className="p-4">{request.priority}</td>
                  <td className="p-4">{request.category}</td>
                  <td className="p-4">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}