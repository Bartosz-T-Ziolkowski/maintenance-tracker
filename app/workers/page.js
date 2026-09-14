"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function WorkersPage() {
  const router = useRouter();

  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState("");
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

    await getWorkers();
    setLoading(false);
  }

  async function getWorkers() {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setWorkers(data);
  }

  async function addWorker(event) {
    event.preventDefault();

    if (!newWorker.trim()) {
      return;
    }

    const { error } = await supabase
      .from("workers")
      .insert([
        {
          name: newWorker.trim(),
          active: true,
        },
      ]);

    if (error) {
      console.error(error);
      alert("There was a problem adding the worker.");
      return;
    }

    setNewWorker("");
    await getWorkers();
  }

  async function toggleWorker(worker) {
    const { error } = await supabase
      .from("workers")
      .update({
        active: !worker.active,
      })
      .eq("id", worker.id);

    if (error) {
      console.error(error);
      alert("There was a problem updating the worker.");
      return;
    }

    setWorkers(
      workers.map((item) =>
        item.id === worker.id
          ? { ...item, active: !item.active }
          : item
      )
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <p>Loading workers...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">

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

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h1 className="text-3xl font-bold mb-2">
            Manage Workers
          </h1>

          <p className="text-gray-600 mb-6">
            Add workers or control who can be assigned to maintenance requests.
          </p>

          <form
            onSubmit={addWorker}
            className="flex gap-3"
          >
            <input
              type="text"
              placeholder="Worker name"
              value={newWorker}
              onChange={(event) =>
                setNewWorker(event.target.value)
              }
              className="flex-1 border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
            />

            <button
              type="submit"
              className="bg-black text-white px-5 rounded-lg font-semibold"
            >
              Add Worker
            </button>
          </form>

        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">
                  Worker
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {workers.map((worker) => (
                <tr
                  key={worker.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {worker.name}
                  </td>

                  <td className="p-4">
                    {worker.active ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleWorker(worker)
                      }
                      className="border border-gray-400 px-4 py-2 rounded-lg"
                    >
                      {worker.active
                        ? "Deactivate"
                        : "Reactivate"}
                    </button>
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