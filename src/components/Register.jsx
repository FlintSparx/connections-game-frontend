import React, { useState } from "react";

const Register = () => {
  // Form State
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error State
  const [errors, setErrors] = useState({});

  // Success State
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Loading State for API calls
  const [isLoading, setIsLoading] = useState(false);

  // Server error state
  const [serverError, setServerError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error when the user begins to type again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null);
    }
  };

  // Validate a user's email address
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form - Make sure email, password, etc are entered and are entered properly
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username =
        "Username is required and must be at least 3 characters";
    }

    if (!formData.first_name || formData.first_name.length < 3) {
      newErrors.first_name =
        "First name is required and must be at least 3 characters";
    }

    if (!formData.last_name || formData.last_name.length < 3) {
      newErrors.last_name =
        "Last name is required and must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // If there are errors, update error state and prevent the form from being submitted
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If the form is valid, proceed with API submission
    try {
      setIsLoading(true);
      setServerError(null);

      // Prepare data for the API - exclude confirmPassword which is only for frontend validation
      const apiData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      // Make the API call
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
          credentials: "include",
        }
      );

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        // Check for username profanity error and show an alert
        if (response.status === 400 && data.message.includes("inappropriate language")) {
          alert("Username contains inappropriate language.  Please choose a different username.");
        } else {
        // Handle other API errors
        throw new Error(data.message || "Registration failed");
      }
      return;
    }

      // If successful
      console.log("Registration successful:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Show a success message once the form is submitted
  if (isSubmitted) {
    return (
      <div className="list-page-container" style={{ maxWidth: "500px", backgroundColor: "#dcfce7" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className="list-page-title" style={{ color: "#166534" }}>
            Registration Successful!
          </h2>
          <p style={{ color: "#166534" }}>
            Thank you for registering, {formData.first_name}{" "}
            {formData.last_name}. Your account has been created successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-page-container" style={{ maxWidth: "500px" }}>
      <h2 className="list-page-title">Create Account</h2>

      {/* Show server errors at the top of the form */}
      {serverError && (
        <div className="mb-4 p-3" style={{ backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px" }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="filter-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className={`form-control ${errors.username ? "border-red-500" : ""}`}
          />
          {errors.username && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.username}</p>
          )}
        </div>        {/* First Name Field */}
        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="filter-label"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            className={`form-control ${
              errors.first_name ? "border-red-500" : ""
            }`}
          />
          {errors.first_name && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.first_name}</p>
          )}
        </div>

        {/* Last Name Field */}
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="filter-label"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className={`form-control ${
              errors.last_name ? "border-red-500" : ""
            }`}
          />
          {errors.last_name && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.last_name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="filter-label"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={`form-control ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.email}</p>
          )}
        </div>        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="filter-label"
          >
            Enter Your Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={`form-control ${
              errors.password ? "border-red-500" : ""
            }`}
          />          {errors.password && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.password}</p>
          )}
        </div>        {/* Confirm Password Field */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="filter-label"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`form-control ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />          {errors.confirmPassword && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
