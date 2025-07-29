import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const stored = JSON.parse(localStorage.getItem("signupData"));
    if (!stored) return setError("Signup data missing");

    const { email, name, password, address, phone, domain, role } = stored;
    const isVendor = role === "vendor";

    try {
      // 1. Verify OTP
      const otpRes = await fetch(
        isVendor
          ? "http://localhost:3000/verify-otp-vendor"
          : "http://localhost:3000/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.message);

      // 2. Create user or vendor
      const signupUrl = isVendor
        ? "http://localhost:3000/signupvendor"
        : "http://localhost:3000/signupcustomer";

      const signupPayload = isVendor
        ? { name, email, password, address, phone, domain }
        : { name, email, password, address, phone };

      const signupRes = await fetch(signupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupPayload),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.message);

      // 3. Store token
      if (isVendor) {
        localStorage.setItem("vendorToken", signupData.vendorToken);
      } else {
        localStorage.setItem("token", signupData.token);
      }

      localStorage.removeItem("signupData");
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-xl mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700"
        >
          Verify & Create Account
        </button>
      </div>
    </div>
  );
};

export default OtpForm;
