import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Organize Your Wardrobe, Effortlessly
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Keep track of your clothes, plan outfits, and never forget what you own. Your personal wardrobe assistant, now online.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/clothing")}
                className="px-6 py-3 border border-white hover:bg-white hover:text-gray-800 transition rounded-lg font-semibold"
              >
                Explore Wardrobe
              </button>
            </div>
          </div>

          {/* Decorative abstract shapes instead of hero image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
            <div className="w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 absolute top-0 left-1/4 animate-pulse"></div>
            <div className="w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 absolute top-16 left-1/2 animate-pulse animation-delay-500"></div>
            <div className="w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 absolute top-32 left-1/3 animate-pulse animation-delay-1000"></div>
            <div className="w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-30 absolute bottom-0 right-1/4"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Features You'll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">Add & Manage Clothes</h3>
              <p>
                Easily add your clothes, track their condition, and categorize them for quick access.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">Favorite & Outfit Planner</h3>
              <p>
                Mark favorites, plan outfits, and create looks for any occasion in seconds.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">Analytics & Suggestions</h3>
              <p>
                See your wear trends, get weather-based clothing suggestions, and optimize your wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Why Choose Wardrobe App?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6">
              <p className="text-xl font-semibold mb-4">Organized</p>
              <p>All your clothes in one place, neatly categorized and easy to manage.</p>
            </div>
            <div className="p-6">
              <p className="text-xl font-semibold mb-4">Smart Suggestions</p>
              <p>Get outfit and weather-based suggestions every day to simplify your choices.</p>
            </div>
            <div className="p-6">
              <p className="text-xl font-semibold mb-4">Track Usage</p>
              <p>See how often you wear each item and maintain a sustainable wardrobe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-indigo-600 text-white py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Organize Your Wardrobe?
        </h2>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-yellow-400 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Wardrobe App. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button onClick={() => navigate("/privacy")} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => navigate("/terms")} className="hover:text-white transition">Terms of Service</button>
            <button onClick={() => navigate("/contact")} className="hover:text-white transition">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
