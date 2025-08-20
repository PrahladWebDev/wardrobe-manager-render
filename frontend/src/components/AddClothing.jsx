import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const materialOptions = [
  { label: "Cotton (Natural, soft, breathable)", value: "cotton" },
  { label: "Linen (Natural, lightweight, breathable)", value: "linen" },
  { label: "Wool (Natural, warm, insulating)", value: "wool" },
  { label: "Silk (Natural, smooth, lustrous)", value: "silk" },
  { label: "Leather (Natural, durable, flexible)", value: "leather" },
  { label: "Hemp (Natural, strong, eco-friendly)", value: "hemp" },
  { label: "Polyester (Synthetic, durable, wrinkle-resistant)", value: "polyester" },
  { label: "Nylon (Synthetic, strong, quick-drying)", value: "nylon" },
  { label: "Acrylic (Synthetic, lightweight, wool-like)", value: "acrylic" },
  { label: "Spandex / Lycra (Synthetic, highly stretchable)", value: "spandex" },
  { label: "Rayon / Viscose (Semi-synthetic, soft, breathable)", value: "rayon" },
  { label: "Cotton-Polyester (Blended, soft + wrinkle-resistant)", value: "cotton-polyester" },
  { label: "Wool-Silk (Blended, warm + smooth)", value: "wool-silk" },
  { label: "Nylon-Spandex (Blended, stretchable + strong)", value: "nylon-spandex" },
  { label: "Denim (Special, cotton twill weave, sturdy)", value: "denim" },
  { label: "Corduroy (Special, ribbed cotton fabric)", value: "corduroy" },
  { label: "Fleece (Special, soft, insulating synthetic)", value: "fleece" },
  { label: "Chiffon (Special, lightweight, sheer)", value: "chiffon" },
  { label: "Velvet (Special, soft dense pile, luxurious)", value: "velvet" },
  { label: "Rubber (Shoes, flexible, waterproof)", value: "rubber" },
  { label: "Suede (Shoes, soft leather, textured)", value: "suede" },
  { label: "Canvas (Shoes, durable, breathable)", value: "canvas" },
  { label: "Stainless Steel (Watch, durable, corrosion-resistant)", value: "stainless-steel" },
  { label: "Titanium (Watch, lightweight, strong)", value: "titanium" },
  { label: "Ceramic (Watch, scratch-resistant, modern)", value: "ceramic" },
];

const AddClothing = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "shirt",
    color: "",
    brand: "",
    material: "",
    season: "all",
    condition: "new",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("image", file);

      await axios.post("https://wardrobe-manager-render.onrender.com/api/clothing", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/clothing");
    } catch (err) {
      console.error(err);
      setError("Failed to add clothing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Clothing Item
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Clothing Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 placeholder-gray-400"
            required
          />

          {/* Category */}
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
          >
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
            <option value="jacket">Jacket</option>
            <option value="accessory">Accessory</option>
                        <option value="watch">Watch</option>
            <option value="other">Other</option>
          </select>

          {/* Color, Brand, Material */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="Color"
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <input
              type="text"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="Brand"
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <select
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
              required
            >
              <option value="">Select Material</option>
              {materialOptions.map((mat) => (
                <option key={mat.value} value={mat.value} title={mat.label}>
                  {mat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Season & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
              <option value="all">All Seasons</option>
            </select>

            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
            >
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="torn">Torn</option>
              <option value="donated">Donated</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none"
            />
            {file && (
              <div className="mt-3 flex justify-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/clothing")}
              className="w-1/2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 py-3 bg-indigo-600 text-white font-semibold rounded-xl transition duration-300 shadow-md flex items-center justify-center ${
                isLoading
                  ? "opacity-75 cursor-not-allowed animate-pulse"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Uploading..." : "Add Clothing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClothing;
