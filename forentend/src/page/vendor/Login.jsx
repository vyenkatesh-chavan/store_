import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const VendorLogin = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [error, setError] = useState("");
    const navigate = useNavigate(); 
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            return setError("Email and password are required");
        }

        try {
            const response = await fetch("http://localhost:3000/loginvendor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("vendorToken", data.vendorToken);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4  
text-center text-indigo-600">Vendor Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded-xl mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded-xl mb-4"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <span
                        className="text-indigo-600 cursor-pointer"
                        onClick={() => navigate("/vendor-signup")}
                    >
                        Signup  here
                    </span>
                </p>
            </div>
        </div>
    );
};  
export default VendorLogin;

                

