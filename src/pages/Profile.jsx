import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

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
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wins, setWins] = useState(0);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user was redirected here for profile update
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("update") === "required") {
      setIsEditing(true);
      setNeedsUpdate(true);
      setError("Your profile needs to be updated with additional information.");
    }

    // Fetch user profile data
    fetch(`${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`, {
      headers: {
        Authorization: `Bearer ${
          document.cookie.split("auth_token=")[1].split(";")[0]
        }`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          newPassword: "",
          currentPassword: "",
        });
      })
      .catch((err) => {
        setError("Failed to load profile data");
        console.error(err);
      });

    // Fetch user wins
    fetch(`${import.meta.env.VITE_API_URL}/games/wins/${user.userID}`, {
      headers: {
        Authorization: `Bearer ${
          document.cookie.split("auth_token=")[1]?.split(";")[0]
        }`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWins(data.wins || 0);
      })
      .catch((err) => {
        console.error("Failed to load win count", err);
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
        Authorization: `Bearer ${
          document.cookie.split("auth_token=")[1].split(";")[0]
        }`,
        "Content-Type": "application/json",
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("auth_token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify(formData),
        },
      );

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
    const password = window.prompt(
      "Enter your password to confirm account deletion:",
    );

    if (!password) {
      return; // User canceled the prompt
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/profile/${user.userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("auth_token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({ password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear auth token
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setToken(null);
      alert("Your account has been deleted successfully.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete account");
    }
  };

  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {!isEditing ? (
        <div className="profile-view-card">
          <div className="profile-field">
            <label className="profile-label">Username:</label>
            <p className="profile-value">{formData.username}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Email:</label>
            <p className="profile-value">{formData.email}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">First Name:</label>
            <p className="profile-value">{formData.first_name}</p>
          </div>{" "}
          <div className="profile-field">
            <label className="profile-label">Last Name:</label>
            <p className="profile-value">{formData.last_name}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Date of Birth:</label>
            <p className="profile-value">
              {formData.dateOfBirth
                ? new Date(formData.dateOfBirth).toLocaleDateString()
                : "Not provided"}
            </p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Games Won:</label>
            <p className="profile-value">{wins}</p>
          </div>
          <div className="profile-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="profile-edit-btn"
            >
              Edit Profile
            </button>
            <button onClick={handleDelete} className="profile-delete-btn">
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}
          <div className="profile-input-group">
            <label className="profile-input-label">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="profile-input"
            />
          </div>
          <div className="profile-input-group">
            <label className="profile-input-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="profile-input"
            />
          </div>
          <div className="profile-input-group">
            <label className="profile-input-label">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="profile-input"
            />
          </div>{" "}
          <div className="profile-input-group">
            <label className="profile-input-label">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="profile-input"
            />
          </div>
          <div className="profile-input-group">
            <label className="profile-input-label">Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`profile-input ${
                needsUpdate ? "profile-required-input" : ""
              }`}
              required={needsUpdate}
            />
          </div>
          <div className="profile-input-group">
            <label className="profile-input-label">
              New Password (optional):
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="profile-input"
            />
          </div>
          <div className="profile-input-group">
            <label className="profile-input-label profile-required-label">
              Current Password (required):
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="profile-input profile-required-input"
              required
            />
          </div>
          <div className="profile-form-actions">
            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="profile-cancel-btn"
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
