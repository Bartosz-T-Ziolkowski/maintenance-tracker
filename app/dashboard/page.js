
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const STATUSES = [
  "New",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Completed",
];

function getPriorityNumber(priority) {
  if (priority === "Emergency") return 4;
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  if (priority === "Low") return 1;
  return 0;
}

function getPriorityStyle(priority) {
  if (priority === "Emergency")
    return "bg-red-100 text-red-800 border-red-200";
  if (priority === "High")
    return "bg-orange-100 text-orange-800 border-orange-200";
  if (priority === "Medium")
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (priority === "Low")
    return "bg-green-100 text-green-800 border-green-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function WorkerSelect({ request, workers, onChange }) {
  const assigned = request.assigned_to || "";

  return (
    <select
      aria-label={`Worker for request ${request.id}`}
      value={assigned}
      onChange={(event) =>
        onChange(request.id, event.target.value)
      }
      className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900"
    >
      <option value="">Unassigned</option>
      {assigned &&
        !workers.some((worker) => worker.name === assigned) && (
          <option value={assigned}>{assigned} (Inactive)</option>
        )}
      {workers.map((worker) => (
        <option key={worker.id} value={worker.name}>
          {worker.name}
        </option>
      ))}
    </select>
  );
}

function StatusSelect({ request, onChange }) {
  return (
    <select
      aria-label={`Status for request ${request.id}`}
      value={request.status || "New"}
      onChange={(event) =>
        onChange(request.id, event.target.value)
      }
      className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function RequestList({
  requests,
  workers,
  onStatusChange,
  onWorkerChange,
}) {
  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        No maintenance requests found.
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 p-3 md:hidden">
        {requests.map((request) => (
          <article
            key={request.id}
            className={`rounded-xl border p-4 ${
              request.priority === "Emergency"
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/request/${request.id}`}
                  className="text-lg font-bold text-blue-700 hover:underline"
                >
                  Request #{request.id}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(request.created_at)}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(
                  request.priority
                )}`}
              >
                {request.priority}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium break-words">
                  {request.department}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Equipment</p>
                <p className="font-medium break-words">
                  {request.equipment}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Problem</p>
                <p className="break-words text-gray-700">
                  {request.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Requester</p>
                  <p className="font-medium break-words">
                    {request.requester_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium break-words">
                    {request.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Assigned Worker
                </label>
                <WorkerSelect
                  request={request}
                  workers={workers}
                  onChange={onWorkerChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Status
                </label>
                <StatusSelect
                  request={request}
                  onChange={onStatusChange}
                />
              </div>
            </div>

            <Link
              href={`/request/${request.id}`}
              className="mt-4 block rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
            >
              View Request Details →
            </Link>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "ID",
                "Created",
                "Requester",
                "Location",
                "Equipment",
                "Problem",
                "Priority",
                "Category",
                "Assigned To",
                "Status",
              ].map((heading) => (
                <th key={heading} className="p-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className={`border-t border-gray-200 ${
                  request.priority === "Emergency"
                    ? "bg-red-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="p-3">
                  <Link
                    href={`/request/${request.id}`}
                    className="font-semibold text-blue-700 underline"
                  >
                    #{request.id}
                  </Link>
                </td>
                <td className="whitespace-nowrap p-3">
                  {formatDate(request.created_at)}
                </td>
                <td className="p-3">{request.requester_name}</td>
                <td className="p-3">{request.department}</td>
                <td className="p-3">{request.equipment}</td>
                <td className="max-w-xs p-3">
                  <p className="line-clamp-3 break-words">
                    {request.description}
                  </p>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </span>
                </td>
                <td className="p-3">{request.category}</td>
                <td className="min-w-36 p-3">
                  <WorkerSelect
                    request={request}
                    workers={workers}
                    onChange={onWorkerChange}
                  />
                </td>
                <td className="min-w-40 p-3">
                  <StatusSelect
                    request={request}
                    onChange={onStatusChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const [requestsResult, workersResult] = await Promise.all([
        supabase
          .from("maintenance_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("workers")
          .select("*")
          .eq("active", true)
          .order("name", { ascending: true }),
      ]);

      if (requestsResult.error) {
        console.error(requestsResult.error);
      } else {
        setRequests(requestsResult.data || []);
      }

      if (workersResult.error) {
        console.error(workersResult.error);
      } else {
        setWorkers(workersResult.data || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function updateStatus(id, newStatus) {
    const current = requests.find((request) => request.id === id);
    if (!current) return;

    const today = new Date().toLocaleDateString("en-CA");
    const updates = { status: newStatus };

    if (newStatus === "In Progress" && !current.date_started) {
      updates.date_started = today;
    }

    if (newStatus === "Completed" && !current.date_completed) {
      updates.date_completed = today;

      if (!current.date_started) {
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

    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? { ...request, ...updates }
          : request
      )
    );
  }

  async function updateAssignedTo(id, assignedTo) {
    const { error } = await supabase
      .from("maintenance_requests")
      .update({ assigned_to: assignedTo || null })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("There was a problem assigning the request.");
      return;
    }

    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? { ...request, assigned_to: assignedTo || null }
          : request
      )
    );
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("There was a problem logging out.");
      return;
    }

    router.push("/login");
  }

  function filterAndSortRequests(list, isCompleted = false) {
    const searchText = search.trim().toLowerCase();

    return list
      .filter((request) => {
        const searchableFields = [
          request.id,
          request.requester_name,
          request.department,
          request.equipment,
          request.description,
          request.category,
          request.assigned_to,
        ];

        const matchesSearch = searchableFields.some((field) =>
          String(field ?? "").toLowerCase().includes(searchText)
        );

        const matchesStatus =
          isCompleted ||
          statusFilter === "All" ||
          request.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" ||
          request.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortOption === "Newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        }

        if (sortOption === "Oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        }

        if (sortOption === "Highest Priority") {
          return getPriorityNumber(b.priority) - getPriorityNumber(a.priority);
        }

        if (sortOption === "Lowest Priority") {
          return getPriorityNumber(a.priority) - getPriorityNumber(b.priority);
        }

        return 0;
      });
  }

  const activeRequests = requests.filter(
    (request) => request.status !== "Completed"
  );

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  );

  const filteredActiveRequests = filterAndSortRequests(activeRequests);
  const filteredCompletedRequests = filterAndSortRequests(
    completedRequests,
    true
  );

  const statistics = [
    { label: "Active Requests", value: activeRequests.length },
    {
      label: "New",
      value: requests.filter((request) => request.status === "New").length,
    },
    {
      label: "In Progress",
      value: requests.filter(
        (request) => request.status === "In Progress"
      ).length,
    },
    { label: "Completed", value: completedRequests.length },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 text-gray-900">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen min-w-0 bg-gray-100 px-3 py-5 text-gray-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Maintenance Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                View and manage maintenance requests.
              </p>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              className="shrink-0 rounded-lg border border-gray-300 bg-white p-3 shadow-sm lg:hidden"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            {/* Desktop navigation */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                href="/analytics"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold hover:bg-gray-50"
              >
                Analytics
              </Link>
              <Link
                href="/workers"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold hover:bg-gray-50"
              >
                Manage Workers
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-4 py-2.5 font-semibold text-white hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {menuOpen && (
            <nav className="mt-4 space-y-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:hidden">
              <Link
                href="/analytics"
                className="block rounded-lg px-4 py-3 font-medium hover:bg-gray-100"
              >
                Analytics
              </Link>
              <Link
                href="/workers"
                className="block rounded-lg px-4 py-3 font-medium hover:bg-gray-100"
              >
                Manage Workers
              </Link>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-gray-900 px-4 py-3 text-left font-medium text-white"
              >
                Log Out
              </button>
            </nav>
          )}
        </div>

        {/* Statistics */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statistics.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold sm:text-3xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filters */}
        <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <label className="mb-1 block text-sm font-semibold">
                Search
              </label>
              <input
                type="search"
                placeholder="Search requests..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 lg:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-3 text-sm text-gray-900"
              >
                <option value="All">All</option>
                {STATUSES.filter((status) => status !== "Completed").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-3 text-sm text-gray-900"
              >
                <option value="All">All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <label className="mb-1 block text-sm font-semibold">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Highest Priority</option>
                <option>Lowest Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active requests */}
        <section className="mb-5 min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Active Requests
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Requests that still require attention.
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
                {filteredActiveRequests.length}
              </span>
            </div>
          </div>

          <RequestList
            requests={filteredActiveRequests}
            workers={workers}
            onStatusChange={updateStatus}
            onWorkerChange={updateAssignedTo}
          />
        </section>

        {/* Completed requests */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowCompleted((open) => !open)}
            aria-expanded={showCompleted}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
          >
            <div>
              <h2 className="text-lg font-bold">
                Completed Requests ({completedRequests.length})
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Previously completed maintenance work.
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold">
              {showCompleted ? "▲ Hide" : "▼ View"}
            </span>
          </button>

          {showCompleted && (
            <div className="border-t border-gray-200">
              <RequestList
                requests={filteredCompletedRequests}
                workers={workers}
                onStatusChange={updateStatus}
                onWorkerChange={updateAssignedTo}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
