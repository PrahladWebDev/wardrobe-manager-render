import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditOutfit = ({ token }) => {
  const [formData, setFormData] = useState({ name: "", season: "all", items: [] });
  const [clothes, setClothes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/outfits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          season: response.data.season,
          items: response.data.items.map((item) => item._id),
        });
      } catch (err) {
        console.error("Failed to fetch outfit", err);
        setError("Failed to fetch outfit. Please try again.");
      }
    };

    const fetchClothes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clothing", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClothes(response.data);
      } catch (err) {
        console.error("Failed to fetch clothes", err);
        setError("Failed to fetch clothes. Please try again.");
      }
    };

    if (token) {
      fetchOutfit();
      fetchClothes();
    }
  }, [token, id]);

  const handleItemToggle = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.includes(itemId)
        ? formData.items.filter((id) => id !== itemId)
        : [...formData.items, itemId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/outfits/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      navigate("/outfits");
    } catch (err) {
      console.error("Failed to update outfit", err);
      setError("Failed to update outfit. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">✏️ Edit Outfit</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Outfit Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Outfit Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter outfit name"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Season</label>
          <select
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="spring">🌸 Spring</option>
            <option value="summer">☀️ Summer</option>
            <option value="fall">🍂 Fall</option>
            <option value="winter">❄️ Winter</option>
            <option value="all">🌍 All Seasons</option>
          </select>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">👕 Select Items</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clothes.map((item) => (
              <li
                key={item._id}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.items.includes(item._id)}
                  onChange={() => handleItemToggle(item._id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <span className="text-sm text-gray-700">{item.name} - {item.category}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ✅ Update Outfit
          </button>
          <button
            type="button"
            onClick={() => navigate("/outfits")}
            className="px-5 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 transition"
          >
            ⬅ Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOutfit;
