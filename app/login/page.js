"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      setErrorMessage("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-2">
          Maintenance Login
        </h1>

        <p className="text-gray-600 mb-6">
          Sign in to access the maintenance dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-400 rounded-lg p-3 bg-white text-gray-900"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Sign In
          </button>

        </form>

      </div>
    </main>
  );
}