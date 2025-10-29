import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = ({ setToken }) => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validToken, setValidToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.get(`https://wardrobe-manager-render.onrender.com/api/auth/reset-password/${token}`);
        setValidToken(true);
      } catch {
        setValidToken(false);
        setError("Invalid or expired reset link");
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`https://wardrobe-manager-render.onrender.com/api/auth/reset-password/${token}`, { password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/clothing"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  if (validToken === null) return <p className="text-center">Validating token...</p>;
  if (!validToken) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-gray-700 placeholder-gray-400"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-gray-700 placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition duration-300 shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
