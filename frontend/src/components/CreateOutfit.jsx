import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOutfit = ({ token }) => {
  const [formData, setFormData] = useState({ name: '', season: 'all', items: [] });
  const [clothes, setClothes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clothing', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClothes(response.data);
      } catch (err) {
        console.error('Failed to fetch clothes', err);
      }
    };
    if (token) fetchClothes();
  }, [token]);

  const handleItemToggle = (id) => {
    setFormData({
      ...formData,
      items: formData.items.includes(id)
        ? formData.items.filter((itemId) => itemId !== id)
        : [...formData.items, id],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/outfits', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/outfits');
    } catch (err) {
      console.error('Failed to create outfit', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">👕 Create Outfit</h2>

      {/* Outfit Form */}
      <div className="space-y-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Outfit Name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <select
          value={formData.season}
          onChange={(e) => setFormData({ ...formData, season: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
          <option value="all">All Seasons</option>
        </select>

        <h3 className="text-lg font-semibold text-gray-700">Select Items</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {clothes.map((item) => (
            <label
              key={item._id}
              className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition ${
                formData.items.includes(item._id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.items.includes(item._id)}
                onChange={() => handleItemToggle(item._id)}
                className="hidden"
              />
              <img
                src={item.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md mb-2"
              />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-xs text-gray-500">{item.category}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ✅ Create
          </button>
          <button
            onClick={() => navigate('/outfits')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;
