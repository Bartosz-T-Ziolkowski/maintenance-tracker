import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow text-center">

        <div className="text-5xl mb-4">
          ✓
        </div>

        <h1 className="text-3xl font-bold mb-3">
          Maintenance Request Submitted
        </h1>

        <p className="text-gray-600 mb-6">
          Your maintenance request has been received successfully.
        </p>

        <div className="bg-gray-100 rounded-lg p-5 mb-6">
          <p className="font-semibold">
            Your request has been sent to the maintenance team.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Submit Another Request
        </Link>

      </div>
    </main>
  );
}