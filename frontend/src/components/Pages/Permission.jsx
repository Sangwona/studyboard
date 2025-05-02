import React, { useState } from "react";

const Permissions = () => {
  const [users, setUsers] = useState([
    { id: "u001", name: "Alice", role: "User" },
    { id: "u002", name: "Bob", role: "Manager" },
    { id: "u003", name: "Charlie", role: "User" },
  ]);

  const handleRoleChange = (id, newRole) => {
    const updated = users.map((user) => (user.id === id ? { ...user, role: newRole } : user));
    setUsers(updated);
  };

  const handleSave = () => {
    console.log("Updated Roles:", users);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Assign Roles (Manager Only)</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">User ID</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="border rounded-md px-2 py-1">
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
};

export default Permissions;
