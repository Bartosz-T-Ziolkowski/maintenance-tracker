"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    await Promise.all([
      getRequests(),
      getWorkers(),
    ]);

    setLoading(false);
  }

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

  async function getWorkers() {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setWorkers(data);
  }

  async function updateStatus(id, newStatus) {
    const today = new Date().toISOString().split("T")[0];

    const currentRequest = requests.find(
      (request) => request.id === id
    );

    const updates = {
      status: newStatus,
    };

    if (
      newStatus === "In Progress" &&
      !currentRequest.date_started
    ) {
      updates.date_started = today;
    }

    if (
      newStatus === "Completed" &&
      !currentRequest.date_completed
    ) {
      updates.date_completed = today;

      if (!currentRequest.date_started) {
        updates.date_started = today;
      }
    }

    const { error } = await supabase
      .from("maintenance_requests")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("There was a problem updating the status.");
      return;
    }

    setRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, ...updates }
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    return new Date(dateString).toLocaleDateString();
  }

  function getPriorityStyle(priority) {
    if (priority === "Emergency") {
      return "bg-red-100 text-red-800 border border-red-300";
    }

    if (priority === "High") {
      return "bg-orange-100 text-orange-800 border border-orange-300";
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }

    if (priority === "Low") {
      return "bg-green-100 text-green-800 border border-green-300";
    }

    return "bg-gray-100 text-gray-800 border border-gray-300";
  }

  function getPriorityNumber(priority) {
    if (priority === "Emergency") {
      return 4;
    }

    if (priority === "High") {
      return 3;
    }

    if (priority === "Medium") {
      return 2;
    }

    if (priority === "Low") {
      return 1;
    }

    return 0;
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

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    if (sortOption === "Oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    if (sortOption === "Highest Priority") {
      return (
        getPriorityNumber(b.priority) -
        getPriorityNumber(a.priority)
      );
    }

    if (sortOption === "Lowest Priority") {
      return (
        getPriorityNumber(a.priority) -
        getPriorityNumber(b.priority)
      );
    }

    return 0;
  });

  // Request overview
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

  // Repair cost analytics
  const totalRepairCost = requests.reduce(
    (total, request) =>
      total + Number(request.cost || 0),
    0
  );

  const requestsWithCost = requests.filter(
    (request) =>
      request.cost !== null &&
      request.cost !== "" &&
      Number(request.cost) > 0
  );

  const averageRepairCost =
    requestsWithCost.length > 0
      ? requestsWithCost.reduce(
          (total, request) =>
            total + Number(request.cost),
          0
        ) / requestsWithCost.length
      : 0;

  const emergencyRequests = requests.filter(
    (request) => request.priority === "Emergency"
  ).length;

  const unassignedRequests = requests.filter(
    (request) => !request.assigned_to
  ).length;

  // Completion time analytics
  const completedWithDates = requests.filter(
    (request) =>
      request.date_started &&
      request.date_completed
  );

  const totalCompletionDays = completedWithDates.reduce(
    (total, request) => {
      const startDate = new Date(
        `${request.date_started}T00:00:00`
      );

      const completedDate = new Date(
        `${request.date_completed}T00:00:00`
      );

      const difference =
        completedDate.getTime() - startDate.getTime();

      const days =
        difference / (1000 * 60 * 60 * 24);

      return total + days;
    },
    0
  );

  const averageCompletionTime =
    completedWithDates.length > 0
      ? totalCompletionDays / completedWithDates.length
      : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Maintenance Dashboard
            </h1>

            <p className="text-gray-700">
              View and manage maintenance requests.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/workers"
              className="border border-gray-400 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Manage Workers
            </Link>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Log Out
            </button>

          </div>

        </div>

        {/* Request Overview */}
        <h2 className="text-xl font-bold mb-3">
          Request Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

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

        {/* Maintenance Analytics */}
        <h2 className="text-xl font-bold mb-3">
          Maintenance Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Total Repair Cost
            </p>

            <p className="text-2xl font-bold">
              ${totalRepairCost.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Average Repair Cost
            </p>

            <p className="text-2xl font-bold">
              ${averageRepairCost.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Average Completion Time
            </p>

            <p className="text-2xl font-bold">
              {averageCompletionTime.toFixed(1)} days
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Emergency Requests
            </p>

            <p className="text-2xl font-bold">
              {emergencyRequests}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-600">
              Unassigned Requests
            </p>

            <p className="text-2xl font-bold">
              {unassignedRequests}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

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

            <div>
              <label className="block font-medium mb-1">
                Sort By
              </label>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="w-full border border-gray-400 rounded-lg p-2 bg-white text-gray-900"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Highest Priority</option>
                <option>Lowest Priority</option>
              </select>
            </div>

          </div>

        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full text-gray-900">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Created</th>
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

              {sortedRequests.map((request) => (
                <tr
                  key={request.id}
                  className={
                    request.priority === "Emergency"
                      ? "border-t bg-red-50"
                      : "border-t"
                  }
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
                    {formatDate(request.created_at)}
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
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityStyle(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
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

                      {workers.map((worker) => (
                        <option
                          key={worker.id}
                          value={worker.name}
                        >
                          {worker.name}
                        </option>
                      ))}

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

                      <option>New</option>
                      <option>Assigned</option>
                      <option>In Progress</option>
                      <option>Waiting for Parts</option>
                      <option>Completed</option>

                    </select>

                  </td>

                </tr>
              ))}

              {sortedRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="10"
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