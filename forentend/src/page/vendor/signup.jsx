import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    domain: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, address, phone, domain } = form;
    if (!name || !email || !password || !address || !phone || !domain) {
      return setError("All fields are required");
    }

    try {
      const response = await fetch("http://localhost:3000/sendvendorotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      localStorage.setItem("signupData", JSON.stringify(form));

      setSuccess("OTP sent to your email. Please verify to complete signup.");
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Vendor Signup</h2>

        <form onSubmit={handleSendOtp}>
          {["name", "email", "password", "address", "phone", "domain"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === "password" ? "password" : "text"}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          ))}

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorSignup;
