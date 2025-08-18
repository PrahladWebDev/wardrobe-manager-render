import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OutfitList = ({ token }) => {
  const [outfits, setOutfits] = useState([]);
  const [randomOutfit, setRandomOutfit] = useState(null);
  const [modalImage, setModalImage] = useState(null); // <-- full-screen modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/outfits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOutfits(response.data);
      } catch (err) {
        console.error("Failed to fetch outfits", err);
      }
    };
    if (token) fetchOutfits();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/outfits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(outfits.filter((outfit) => outfit._id !== id));
      if (randomOutfit && randomOutfit._id === id) setRandomOutfit(null);
    } catch (err) {
      console.error("Failed to delete outfit", err);
    }
  };

  const handleRandomOutfit = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/outfits/random",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRandomOutfit(response.data);
    } catch (err) {
      console.error("Failed to fetch random outfit", err);
      setRandomOutfit(null);
    }
  };

  const renderOutfitCard = (outfit) => (
    <div
      key={outfit._id}
      className="p-4 bg-white shadow-md rounded-xl border border-gray-200 relative"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {outfit.name} <span className="text-sm text-gray-500">({outfit.season})</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/outfits/edit/${outfit._id}`)}
            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            ✏ Edit
          </button>
          <button
            onClick={() => handleDelete(outfit._id)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-3">
        {outfit.items.map((item) => (
          <li
            key={item._id}
            className="flex flex-col items-center bg-gray-100 p-2 rounded-lg w-28 relative"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md cursor-pointer"
                onClick={() => setModalImage(item.image)} // <-- Open modal
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-xs text-gray-600 rounded-md">
                No Img
              </div>
            )}
            <span className="text-xs mt-1 text-gray-700 text-center">{item.name}</span>
            <span className="text-[10px] text-gray-500">{item.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Outfits</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => navigate("/outfits/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Create Outfit
        </button>
        <button
          onClick={handleRandomOutfit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          🎲 Get Random Outfit
        </button>
        <button
          onClick={() => setRandomOutfit(null)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          🔄 Show All
        </button>
        <button
          onClick={() => navigate("/clothing")}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ⬅ Back to Clothing
        </button>
      </div>

      {randomOutfit ? (
        renderOutfitCard(randomOutfit)
      ) : outfits.length === 0 ? (
        <p className="text-gray-500 text-center">No outfits found.</p>
      ) : (
        <div className="grid gap-4">{outfits.map(renderOutfitCard)}</div>
      )}

      {/* Full-Screen Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full View"
            className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing on image click
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={() => setModalImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default OutfitList;
