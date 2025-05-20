import React, { useEffect, useState } from "react";
import fetchWithAuth from "../../utils/fetchWithAuth";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEdit, setUserEdit] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetchWithAuth(`${import.meta.env.VITE_API_URL}/admin/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  const handleEditClick = (user) => {
    setUserEdit(user._id);
    setEditFields({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (user) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/admin/users/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFields),
        }
      );
      if (response.ok) {
        // Update the user in the local state
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, ...editFields } : u))
        );
        setUserEdit(null);
      } else {
        alert("Failed to update the user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while trying to update the user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== id));
        } else {
          alert("Failed to delete the user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while trying to delete the user.");
      }
    }
  };

  return (
    <div>
      <h1>Users Admin</h1>
      <table className="game-boards-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Name</th>
            <th>Admin</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <tr
                onClick={() =>
                  userEdit === user._id
                    ? setUserEdit(null)
                    : handleEditClick(user)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>
                  <div>
                    {user.first_name} {user.last_name}
                  </div>
                </td>
                <td>{user.isAdmin.toString()}</td>
                <td>{user.email}</td>
              </tr>
              {userEdit === user._id && (
                <tr key={user._id + "-expand"}>
                  <td colSpan={5}>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        name="username"
                        value={editFields.username}
                        onChange={handleFieldChange}
                        placeholder="Username"
                      />
                      <input
                        name="first_name"
                        value={editFields.first_name}
                        onChange={handleFieldChange}
                        placeholder="First Name"
                      />
                      <input
                        name="last_name"
                        value={editFields.last_name}
                        onChange={handleFieldChange}
                        placeholder="Last Name"
                      />
                      <input
                        name="email"
                        value={editFields.email}
                        onChange={handleFieldChange}
                        placeholder="Email"
                      />
                      <label>
                        Admin
                        <input
                          type="checkbox"
                          name="isAdmin"
                          checked={!!editFields.isAdmin}
                          onChange={handleFieldChange}
                        />
                      </label>
                      <button onClick={() => handleUpdate(user)}>Save</button>
                      <button onClick={() => setUserEdit(null)}>Cancel</button>
                      <button onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <p>This is the Users Admin page.</p>
    </div>
  );
}

export default UsersAdmin;
