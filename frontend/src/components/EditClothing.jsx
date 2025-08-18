import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditClothing = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'shirt',
    color: '',
    brand: '',
    material: '',
    season: 'all',
    condition: 'new',
    image: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothing = async () => {
      try {
        const response = await axios.get(`https://wardrobe-manager-render.onrender.com/api/clothing/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch clothing. Please try again.');
      }
    };
    if (token) fetchClothing();
  }, [token, id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('color', formData.color);
      data.append('brand', formData.brand);
      data.append('material', formData.material);
      data.append('season', formData.season);
      data.append('condition', formData.condition);
      data.append('image', formData.image); // keep old image
      if (file) {
        data.append('image', file); // overwrite with new file
      }

      await axios.put(`https://wardrobe-manager-render.onrender.com/api/clothing/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/clothing');
    } catch (err) {
      console.error(err);
      setError('Failed to update clothing. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">✏️ Edit Clothing</h2>

      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jacket</option>
          <option value="accessory">Accessory</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          placeholder="Color"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="Brand"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          placeholder="Material"
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

        <select
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="torn">Torn</option>
          <option value="donated">Donated</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>

        {/* File Upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer focus:outline-none"
          />
          {(file || formData.image) && (
            <img
              src={file ? URL.createObjectURL(file) : formData.image}
              alt="Preview"
              className="w-28 h-28 object-cover mt-3 rounded-md border"
            />
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            💾 Update
          </button>
          <button
            type="button"
            onClick={() => navigate('/clothing')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅ Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClothing;
