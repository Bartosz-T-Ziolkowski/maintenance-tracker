export default function Dashboard() {
  const requests = [
    {
      id: 1,
      requester: "Frank Smith",
      location: "Warehouse",
      equipment: "Conveyor Belt",
      problem: "Belt keeps stopping",
      priority: "High",
      status: "New",
    },
    {
      id: 2,
      requester: "Sarah Jones",
      location: "Office",
      equipment: "Air Conditioner",
      problem: "Not cooling properly",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: 3,
      requester: "Mike Davis",
      location: "Break Room",
      equipment: "Sink",
      problem: "Sink is leaking",
      priority: "Low",
      status: "Completed",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Maintenance Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          View and manage maintenance requests.
        </p>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Equipment</th>
                <th className="text-left p-4">Problem</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t"
                >
                  <td className="p-4">{request.id}</td>
                  <td className="p-4">{request.requester}</td>
                  <td className="p-4">{request.location}</td>
                  <td className="p-4">{request.equipment}</td>
                  <td className="p-4">{request.problem}</td>
                  <td className="p-4">{request.priority}</td>
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