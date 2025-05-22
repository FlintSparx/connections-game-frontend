import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, setToken } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    newPassword: "",
    currentPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {    
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Fetch user profile data
    fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`, {
      headers: {
        'Authorization': `Bearer ${document.cookie.split("auth_token=")[1].split(";")[0]}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          newPassword: "",
          currentPassword: "",
        });
      })
      .catch((err) => {
        setError("Failed to load profile data");
        console.error(err);
      });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form function when canceling edits
  const handleCancelEdit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`, {
      headers: {
        'Authorization': `Bearer ${document.cookie.split("auth_token=")[1].split(";")[0]}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          newPassword: "",
          currentPassword: "",
        });
        setIsEditing(false);
        setError("");
      })
      .catch((err) => {
        setError("Failed to reload profile data");
        console.error(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.currentPassword) {
      setError("Current password is required to make changes");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("auth_token=")[1].split(";")[0]}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      if (data.token) {
        document.cookie = `auth_token=${data.token}; path=/;`;
        setToken(data.token);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add an account deletion function
  const handleDelete = async () => {
    const password = window.prompt("Enter your password to confirm account deletion:");
    
    if (!password) {
      return; // User canceled the prompt
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("auth_token=")[1].split(";")[0]}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear auth token
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setToken(null);
      alert("Your account has been deleted successfully.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete account");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {!isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="font-semibold">Username:</label>
            <p>{formData.username}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <p>{formData.email}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold">First Name:</label>
            <p>{formData.first_name}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold">Last Name:</label>
            <p>{formData.last_name}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">New Password (optional):</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-6">
            <label className="block font-semibold mb-1">Current Password (required):</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;
