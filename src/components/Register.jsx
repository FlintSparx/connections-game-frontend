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
        email: formData.email,
        password: formData.password,
      };

      // Make the API call
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
        credentials: "include",
      });

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        // Handle API error
        throw new Error(data.message || "Registration failed");
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
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-green-700">
            Thank you for registering, {formData.first_name}{" "}
            {formData.last_name}. Your account has been created successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Create Account
      </h2>

      {/* Show server errors at the top of the form */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* First Name Field */}
        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="block text-gray-700 font-medium mb-1"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name Field */}
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="block text-gray-700 font-medium mb-1"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          ) : (
            <br />
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-1"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
