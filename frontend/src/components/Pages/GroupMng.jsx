import React, { useState } from "react";

const GroupMng = () => {
  const [group, setGroup] = useState({
    id: "",
    name: "",
    limit: "",
    comment: "",
  });

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    console.log("Created group:", group);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Group</h2>
      <div className="space-y-4">
        <input type="text" name="id" placeholder="Group ID" value={group.id} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="text" name="name" placeholder="Group Name" value={group.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="number" name="limit" placeholder="Member Limit" value={group.limit} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <textarea name="comment" placeholder="Group Description" value={group.comment} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <div className="flex justify-end">
          <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMng;
