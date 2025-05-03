import React, { useState } from "react";

const GroupRequest = () => {
  const [requests, setRequests] = useState([
    { userId: "u001", name: "Alice", date: "2025-04-10" },
    { userId: "u002", name: "Bob", date: "2025-04-12" },
  ]);

  const handleDecision = (userId, accepted) => {
    console.log(`${accepted ? "Approved" : "Rejected"}: ${userId}`);
    setRequests(requests.filter((r) => r.userId !== userId));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Join Requests</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">User ID</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Requested At</th>
            <th className="text-left p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.userId} className="border-b">
              <td className="p-2">{req.userId}</td>
              <td className="p-2">{req.name}</td>
              <td className="p-2">{req.date}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleDecision(req.userId, true)} className="bg-green-600 text-white px-3 py-1 rounded">
                  Approve
                </button>
                <button onClick={() => handleDecision(req.userId, false)} className="bg-red-600 text-white px-3 py-1 rounded">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupRequest;
