"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AnalyticsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

    await getRequests();
    setLoading(false);
  }

  async function getRequests() {
    const { data, error } = await supabase
      .from("maintenance_requests")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setRequests(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function countByField(field, value) {
    return requests.filter(
      (request) => request[field] === value
    ).length;
  }

  function getCostByCategory(category) {
    return requests
      .filter((request) => request.category === category)
      .reduce(
        (total, request) =>
          total + Number(request.cost || 0),
        0
      );
  }

  const categories = [
    "Equipment",
    "Electrical",
    "Plumbing",
    "HVAC",
    "Building",
    "Other",
  ];

  const priorities = [
    "Low",
    "Medium",
    "High",
    "Emergency",
  ];

  const statuses = [
    "New",
    "Assigned",
    "In Progress",
    "Waiting for Parts",
    "Completed",
  ];

  const maxCategoryCount = Math.max(
    1,
    ...categories.map((category) =>
      countByField("category", category)
    )
  );

  const maxPriorityCount = Math.max(
    1,
    ...priorities.map((priority) =>
      countByField("priority", priority)
    )
  );

  const maxStatusCount = Math.max(
    1,
    ...statuses.map((status) =>
      countByField("status", status)
    )
  );

  const maxCategoryCost = Math.max(
    1,
    ...categories.map((category) =>
      getCostByCategory(category)
    )
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <p>Loading analytics...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 underline"
          >
            ← Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Maintenance Analytics
        </h1>

        <p className="text-gray-600 mb-8">
          Review maintenance trends, priorities, status,
          and repair costs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Requests by Category */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Requests by Category
            </h2>

            <div className="space-y-4">
              {categories.map((category) => {
                const count = countByField(
                  "category",
                  category
                );

                const width =
                  (count / maxCategoryCount) * 100;

                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span>{category}</span>
                      <span className="font-semibold">
                        {count}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-black h-5 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requests by Priority */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Requests by Priority
            </h2>

            <div className="space-y-4">
              {priorities.map((priority) => {
                const count = countByField(
                  "priority",
                  priority
                );

                const width =
                  (count / maxPriorityCount) * 100;

                return (
                  <div key={priority}>
                    <div className="flex justify-between mb-1">
                      <span>{priority}</span>
                      <span className="font-semibold">
                        {count}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-black h-5 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requests by Status */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Requests by Status
            </h2>

            <div className="space-y-4">
              {statuses.map((status) => {
                const count = countByField(
                  "status",
                  status
                );

                const width =
                  (count / maxStatusCount) * 100;

                return (
                  <div key={status}>
                    <div className="flex justify-between mb-1">
                      <span>{status}</span>
                      <span className="font-semibold">
                        {count}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-black h-5 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repair Cost by Category */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Repair Cost by Category
            </h2>

            <div className="space-y-4">
              {categories.map((category) => {
                const cost =
                  getCostByCategory(category);

                const width =
                  (cost / maxCategoryCost) * 100;

                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span>{category}</span>
                      <span className="font-semibold">
                        ${cost.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-black h-5 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}