import "../../styles/Groups.css";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";

function Groups() {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/board/groups`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${(await response).status}`);
                }

                const data = await response.json();

                if (data && data.groups) {
                    setGroups(data.groups);
                } else {
                    throw new Error("Invalid data format received from server");
                }
            }
            catch (error) {
                console.error("Error fetching groups:", error);
                setError(error.message); // Store the error message
            } finally {
                setIsLoading(false); // Stop loading, regardless of success or error
            }
        };
        fetchGroups();
    }, []);
  return (
    <div className="groups-wrapper">
      <h2>Group Lists</h2>

      <p>Can't find the group that matches you interst?</p> 

      {/* Should send an API request to create group (ideally, show a form that leads to group creation) */}
      <p className="groups-wrapper-create">Create new group</p>

      {isLoading && <p>Loading groups...</p>}

      {error && <p style={{ color: 'red' }}>Error loading groups: {error}</p>}

      {!isLoading && !error && (
        <ul className="groups-list">
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group.id} className="group-item">
                <h3>{group.group_name}</h3>
                <p className="group-description">{group.description}</p>
                <p>
                  <small>
                    Created: {new Date(group.date).toLocaleDateString()} |
                    Max Members: {group.max_member}
                  </small>
                </p>
                <button>Ask to Join</button>
              </li>
            ))
          ) : (
            <p>No public groups found.</p> /* Message if groups array is empty */
          )}
        </ul>
      )}
    </div>
  );
}

export default Groups;
