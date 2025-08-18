import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

const Analytics = ({ token }) => {
  const [analytics, setAnalytics] = useState({
    categoryCounts: [],
    mostWorn: [],
    leastWorn: [],
    notWornRecently: [],
  });
  const [modalImage, setModalImage] = useState(null); // <-- Full-screen modal
  const categoryChartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/clothing/analytics",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  useEffect(() => {
    let chartInstance;
    if (analytics.categoryCounts.length > 0 && categoryChartRef.current) {
      chartInstance = new Chart(categoryChartRef.current, {
        type: "pie",
        data: {
          labels: analytics.categoryCounts.map((item) => item._id),
          datasets: [
            {
              label: "Items by Category",
              data: analytics.categoryCounts.map((item) => item.count),
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [analytics]);

  const renderItemList = (items, showLastWorn = false) => (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item._id}
          className="flex items-center gap-3 border-b pb-2 relative"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-md object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setModalImage(item.image)} // <-- Open modal
            />
          )}
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-500">
              Worn {item.wearCount} times
              {showLastWorn &&
                ` • Last worn: ${
                  item.lastWorn
                    ? new Date(item.lastWorn).toLocaleDateString()
                    : "Never"
                }`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Wardrobe Analytics
      </h2>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Items by Category
        </h3>
        <div className="flex justify-center">
          <canvas ref={categoryChartRef} className="max-w-md"></canvas>
        </div>
      </div>

      {/* Analytics Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Most Worn */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Most Worn Items
          </h3>
          {renderItemList(analytics.mostWorn)}
        </div>

        {/* Least Worn */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Least Worn Items
          </h3>
          {renderItemList(analytics.leastWorn)}
        </div>

        {/* Not Worn Recently */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Not Worn in 30+ Days
          </h3>
          {renderItemList(analytics.notWornRecently, true)}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/clothing")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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

export default Analytics;
