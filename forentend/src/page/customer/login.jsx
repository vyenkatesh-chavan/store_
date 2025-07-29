import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:3000/logincustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);

      // Navigate to dashboard or home
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-lg">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm
                         text-gray-800 placeholder-gray-500 text-lg font-medium
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50
                         hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm
                         text-gray-800 placeholder-gray-500 text-lg font-medium
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50
                         hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.password}</p>}
          </div>

          {serverError && <p className="text-red-600 text-sm text-center font-semibold animate-pulse">{serverError}</p>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition duration-200">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl text-white text-lg font-bold text-center
                        bg-gradient-to-r from-blue-600 to-indigo-600
                        hover:from-blue-700 hover:to-indigo-700
                        focus:outline-none focus:ring-4 focus:ring-blue-300
                        transition-all duration-200 shadow-xl hover:shadow-2xl
                        transform ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                Logging In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-semibold hover:text-blue-800 cursor-pointer transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
