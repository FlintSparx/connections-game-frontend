import React, { useEffect, useState } from "react";
import fetchWithAuth from "../../utils/fetchWithAuth";
import "../../styles/ListPageStyles.css";

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
  };  return (
    <div className="list-page-container">
      <h1 className="list-page-title mb-4">Users Administration</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table className="list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Admin</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <span className={user.isAdmin ? "difficulty-badge difficulty-easy" : "difficulty-badge difficulty-unknown"}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditClick(user)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Edit Modal Overlay */}
      {userEdit && (
        <div className="edit-overlay" onClick={(e) => e.target === e.currentTarget && setUserEdit(null)}>
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3 className="edit-modal-title">Edit User</h3>
              <button className="edit-modal-close" onClick={() => setUserEdit(null)}>
                ×
              </button>
            </div>
            
            <div className="edit-modal-body">
              <div className="mb-4">
                <label htmlFor="username" className="filter-label">Username</label>
                <input
                  id="username"
                  name="username"
                  value={editFields.username}
                  onChange={handleFieldChange}
                  className="form-control"
                  placeholder="Username"
                />
              </div>
              
              <div className="mb-4" style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="first_name" className="filter-label">First Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    value={editFields.first_name}
                    onChange={handleFieldChange}
                    placeholder="First Name"
                    className="form-control"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="last_name" className="filter-label">Last Name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    value={editFields.last_name}
                    onChange={handleFieldChange}
                    placeholder="Last Name"
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="filter-label">Email</label>
                <input
                  id="email"
                  name="email"
                  value={editFields.email}
                  onChange={handleFieldChange}
                  placeholder="Email"
                  className="form-control"
                />
              </div>
              
              <div className="mb-4">
                <label className="filter-label" style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={!!editFields.isAdmin}
                    onChange={handleFieldChange}
                    style={{ marginRight: "8px" }}
                  />
                  Administrator Privileges
                </label>
              </div>
            </div>
            
            <div className="edit-modal-footer">
              <button className="btn btn-danger" onClick={() => handleDelete(users.find(u => u._id === userEdit))}>
                Delete User
              </button>
              <button className="btn btn-secondary" onClick={() => setUserEdit(null)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={() => handleUpdate(users.find(u => u._id === userEdit))}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersAdmin;
