import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post("https://wardrobe-manager-render.onrender.com/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition duration-300 shadow-md"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <button onClick={() => navigate("/login")} className="text-indigo-600 hover:underline font-medium">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
