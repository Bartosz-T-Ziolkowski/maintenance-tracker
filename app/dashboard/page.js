"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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
      .update({
        assigned_to: assignedTo || null,
      })
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

  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      request.requester_name?.toLowerCase().includes(searchText) ||
      request.department?.toLowerCase().includes(searchText) ||
      request.equipment?.toLowerCase().includes(searchText) ||
      request.description?.toLowerCase().includes(searchText) ||
      request.category?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalRequests = requests.length;

  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const inProgressRequests = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Maintenance Dashboard
        </h1>

        <p className="text-gray-700 mb-6">
          View and manage maintenance requests.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Total Requests
            </p>

            <p className="text-3xl font-bold">
              {totalRequests}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              New
            </p>

            <p className="text-3xl font-bold">
              {newRequests}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              In Progress
            </p>

            <p className="text-3xl font-bold">
              {inProgressRequests}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Completed
            </p>

            <p className="text-3xl font-bold">
              {completedRequests}
            </p>
          </div>

        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block font-medium mb-1">
                Search
              </label>

              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
              >
                <option>All</option>
                <option>New</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Waiting for Parts</option>
                <option>Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                className="w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>

          </div>
        </div>

        {/* Request Table */}
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

              {filteredRequests.map((request) => (
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
                      <option value="">
                        Unassigned
                      </option>

                      <option value="John">
                        John
                      </option>

                      <option value="Mike">
                        Mike
                      </option>

                      <option value="Sarah">
                        Sarah
                      </option>

                    </select>

                  </td>

                  <td className="p-4">

                    <select
                      value={request.status || "New"}
                      onChange={(event) =>
                        updateStatus(
                          request.id,
                          event.target.value
                        )
                      }
                      className="border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
                    >

                      <option>
                        New
                      </option>

                      <option>
                        Assigned
                      </option>

                      <option>
                        In Progress
                      </option>

                      <option>
                        Waiting for Parts
                      </option>

                      <option>
                        Completed
                      </option>

                    </select>

                  </td>

                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="p-8 text-center text-gray-500"
                  >
                    No maintenance requests found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}