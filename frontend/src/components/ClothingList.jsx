import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomCalendar = ({ wearHistory, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Normalize wearHistory dates to year-month-day for comparison
  const getMarkedDates = (history) => {
    if (!history || !Array.isArray(history) || history.length === 0) return [];
    const markedDates = history
      .map((d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return null;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      })
      .filter((date) => date !== null);

    // Remove duplicates
    const uniqueTimes = Array.from(new Set(markedDates.map(d => d.getTime())));
    return uniqueTimes.map(t => new Date(t));
  };

  const wearDates = getMarkedDates(wearHistory);

  // Generate month grid
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < firstDayWeekday; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">←</button>
        <h3 className="text-xl font-semibold text-gray-800">{monthYear}</h3>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-gray-600">{day}</div>
        ))}
        {days.map((day, index) => {
          if (!day) return <div key={index} className="h-10"></div>;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isWorn = wearDates.some(
            (d) => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
          );
          return (
            <div key={index} className={`h-10 flex items-center justify-center rounded-full ${isWorn ? "bg-red-500 text-white" : "text-gray-800"}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const ClothingList = ({ token }) => {
  const [clothes, setClothes] = useState([]);
  const [filters, setFilters] = useState({ category: "", color: "", season: "", condition: "", isFavorite: "" });
  const [modalImage, setModalImage] = useState(null);
  const [calendarItem, setCalendarItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clothing", {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });

        // Parse wearHistory strings to Date objects
        const clothesWithDates = response.data.map((item) => ({
          ...item,
          wearHistory: (item.wearHistory || []).map((d) => new Date(d))
        }));

        setClothes(clothesWithDates);
      } catch (err) {
        console.error("Failed to fetch clothes", err);
      }
    };
    if (token) fetchClothes();
  }, [token, filters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clothing/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setClothes(clothes.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete clothing", err);
    }
  };

  const handleFavorite = async (id, isFavorite) => {
    try {
      await axios.put(`http://localhost:5000/api/clothing/${id}`, { isFavorite: !isFavorite }, { headers: { Authorization: `Bearer ${token}` } });
      setClothes(clothes.map((item) => item._id === id ? { ...item, isFavorite: !isFavorite } : item));
    } catch (err) {
      console.error("Failed to update favorite", err);
    }
  };

  const handleWear = async (id) => {
    try {
      const current = clothes.find((item) => item._id === id);
      const now = new Date();

      // Backend appends the new wear date automatically
      await axios.put(`http://localhost:5000/api/clothing/${id}`, { wearCount: current.wearCount + 1, lastWorn: now }, { headers: { Authorization: `Bearer ${token}` } });

      // Optimistically update local state
      setClothes(
        clothes.map((item) => item._id === id
          ? { ...item, wearCount: item.wearCount + 1, lastWorn: now, wearHistory: [...(item.wearHistory || []), now] }
          : item
        )
      );
    } catch (err) {
      console.error("Failed to update wear count", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Wardrobe</h2>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="">All Categories</option>
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jacket</option>
          <option value="accessory">Accessory</option>
          <option value="other">Other</option>
        </select>
        <input type="text" placeholder="Color" onChange={(e) => setFilters({ ...filters, color: e.target.value })} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
        <select onChange={(e) => setFilters({ ...filters, season: e.target.value })} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="">All Seasons</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
          <option value="all">All Seasons</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, condition: e.target.value })} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="torn">Torn</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, isFavorite: e.target.value })} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
          <option value="">All</option>
          <option value="true">Favorites</option>
          <option value="false">Non-Favorites</option>
        </select>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button onClick={() => navigate("/clothing/add")} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition">➕ Add Clothing</button>
        <button onClick={() => navigate("/outfits")} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition">👕 View Outfits</button>
        <button onClick={() => navigate("/analytics")} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition">📊 View Analytics</button>
        <button onClick={() => navigate("/weather")} className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition">☀️ Weather Suggestions</button>
        <button onClick={() => navigate("/clothing/calendar")} className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md transition">📅 Calendar</button>
      </div>

      {/* Clothing Grid */}
      {clothes.length === 0 ? (
        <p className="text-center text-gray-600">No clothes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clothes.map((item) => (
            <div key={item._id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-40 w-full object-cover cursor-pointer" onClick={() => setModalImage(item.image)} />
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category} • {item.color} • {item.season} • {item.condition}</p>
                <p className="text-xs text-gray-500 mt-1">Worn {item.wearCount} times</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => handleFavorite(item._id, item.isFavorite)} className={`px-3 py-1 rounded-lg text-sm font-medium shadow-md transition ${item.isFavorite ? "bg-yellow-400 text-white hover:bg-yellow-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                    {item.isFavorite ? "★ Favorite" : "☆ Favorite"}
                  </button>

                  <button onClick={() => handleWear(item._id)} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm shadow-md hover:bg-indigo-700 transition">👟 Wear</button>

                  <button onClick={() => navigate(`/clothing/edit/${item._id}`)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm shadow-md hover:bg-blue-700 transition">✏️ Edit</button>

                  <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm shadow-md hover:bg-red-700 transition">🗑️ Delete</button>

                  <button onClick={() => setCalendarItem(item)} className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm shadow-md hover:bg-teal-700 transition">📅 View Calendar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Full View" className="max-h-full max-w-full object-contain rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()} />
          <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={() => setModalImage(null)}>&times;</button>
        </div>
      )}

      {/* Calendar Modal */}
      {calendarItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setCalendarItem(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CustomCalendar wearHistory={calendarItem.wearHistory} onClose={() => setCalendarItem(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingList;
