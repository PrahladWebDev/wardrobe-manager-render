import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WeatherSuggestions = () => {
  const [suggestions, setSuggestions] = useState({ season: "", clothes: [] });
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null); // <-- Full-screen modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeatherSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            "https://wardrobe-manager-render.onrender.com/api/clothing/weather-suggestions",
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { lat: latitude, lon: longitude },
            }
          );

          setSuggestions(response.data);
          setLoading(false);
        });
      } catch (err) {
        console.error("Failed to fetch weather suggestions", err);
        setLoading(false);
      }
    };

    fetchWeatherSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">
          Loading weather suggestions...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Weather Suggestions 🌤️
      </h2>

      <p className="text-center text-gray-500 mb-6">
        Recommended clothes for this{" "}
        <span className="font-bold text-blue-500">{suggestions.season}</span>{" "}
        season
      </p>

      {suggestions.clothes.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          No clothes found for this season.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.clothes.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border hover:shadow-md transition relative group"
            >
              <div
                className="relative w-16 h-16 cursor-pointer"
                onClick={() => setModalImage(item.image || "https://via.placeholder.com/100")} // <-- Open modal
              >
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg border transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/clothing")}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Back
        </button>
      </div>

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

export default WeatherSuggestions;
