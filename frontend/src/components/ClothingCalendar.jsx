import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ClothingCalendar = ({ token }) => {
  const [clothes, setClothes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().setHours(0, 0, 0, 0));
  const [error, setError] = useState('');
  const [modalImage, setModalImage] = useState(null); // <-- For full-screen modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clothing', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClothes(response.data);
        setError('');
        console.log('Fetched clothes:', response.data);
      } catch (err) {
        console.error('Failed to fetch clothes', err);
        setError('Failed to fetch clothes. Please try again.');
      }
    };
    if (token) fetchClothes();
  }, [token]);

  const getClothesByDate = (date) => {
    const dateString = new Date(date).toLocaleDateString('en-CA');
    return clothes.filter((item) => {
      if (!item.lastWorn) return false;
      const wornDate = new Date(item.lastWorn).toLocaleDateString('en-CA');
      return wornDate === dateString;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const wornClothes = getClothesByDate(date);
      return wornClothes.length > 0 ? (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      ) : null;
    }
    return null;
  };

  const wornClothes = getClothesByDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        👗 Clothing Wear Calendar
      </h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <Calendar
          onChange={(date) => setSelectedDate(new Date(date.setHours(0, 0, 0, 0)))}
          value={selectedDate}
          tileContent={tileContent}
          className="mb-6 rounded-xl overflow-hidden shadow-inner border border-gray-200"
        />

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Clothes Worn on {new Date(selectedDate).toLocaleDateString()}
        </h3>

        {wornClothes.length === 0 ? (
          <p className="text-gray-600 text-center">No clothes worn on this date.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wornClothes.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover cursor-pointer"
                    onClick={() => setModalImage(item.image)} // <-- Open modal
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.category} • {item.color} • {item.season} • {item.condition}
                  </p>
                  {item.wearCount > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Worn {item.wearCount} {item.wearCount > 1 ? 'times' : 'time'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/clothing')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          ⬅ Back to Wardrobe
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
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
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

export default ClothingCalendar;
