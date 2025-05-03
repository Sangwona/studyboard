import React, { useState } from "react";

const GroupList = () => {
  const [groups, setGroups] = useState([
    { id: "g001", name: "AI Study", limit: 10, members: 5, description: "Weekly AI discussions", status: "none" },
    { id: "g002", name: "Leetcode", limit: 8, members: 8, description: "Daily challenges", status: "pending" },
    { id: "g003", name: "UI/UX Jam", limit: 6, members: 2, description: "Design & review", status: "joined" },
  ]);

  const handleToggle = (id, currentStatus) => {
    const updated = groups.map((g) =>
      g.id === id
        ? {
            ...g,
            status: currentStatus === "joined" ? "none" : currentStatus === "pending" ? "none" : "pending",
          }
        : g
    );
    setGroups(updated);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Available Groups</h2>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
                <p className="text-sm mt-1">
                  Members: {group.members}/{group.limit}
                </p>
              </div>
              <div>
                {group.status === "joined" && (
                  <button onClick={() => handleToggle(group.id, group.status)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Leave
                  </button>
                )}
                {group.status === "pending" && (
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded" disabled>
                    Pending
                  </button>
                )}
                {group.status === "none" && group.members < group.limit && (
                  <button onClick={() => handleToggle(group.id, group.status)} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Join
                  </button>
                )}
                {group.status === "none" && group.members >= group.limit && (
                  <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
                    Full
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
