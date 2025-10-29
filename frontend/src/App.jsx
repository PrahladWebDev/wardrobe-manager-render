import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { FaTshirt, FaList, FaChartBar, FaCloudSun, FaCalendarAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Login from "./components/Login";
import ForgotPassword from './components/ForgotPassword'; // ← ADD THIS
import ResetPassword from './components/ResetPassword';   // ← AND THIS
import EmailVerification from './components/EmailVerification'; // ← AND THIS
import Register from "./components/Register";
import ClothingList from "./components/ClothingList";
import AddClothing from "./components/AddClothing";
import EditClothing from "./components/EditClothing";
import OutfitList from "./components/OutfitList";
import CreateOutfit from "./components/CreateOutfit";
import EditOutfit from "./components/EditOutfit";
import Analytics from "./components/Analytics";
import WeatherSuggestions from "./components/WeatherSuggestions";
import ClothingCalendar from "./components/ClothingCalendar";
import LandingPage from "./components/LandingPage";

// Header with token-based nav and hamburger menu
const Header = ({ token, setToken }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <nav className="container mx-auto flex flex-wrap items-center justify-between py-4 px-4 sm:px-6 lg:px-8 text-white">
        <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
          👕 Wardrobe Manager
        </Link>
        <button
          className="sm:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-4 sm:gap-6 text-base sm:text-lg mt-4 sm:mt-0`}
        >
          {token ? (
            <>
              <li>
                <Link
                  to="/clothing"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTshirt /> Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/outfits"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaList /> Outfits
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaChartBar /> Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/weather"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCloudSun /> Weather
                </Link>
              </li>
              <li>
                <Link
                  to="/clothing/calendar"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCalendarAlt /> Calendar
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left sm:w-auto bg-red-500 px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block hover:text-yellow-300 transition duration-200 px-2 py-1 rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <Header token={token} setToken={setToken} />

        {/* Page Content */}
        <main className="flex-grow container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={token ? <Navigate to="/clothing" /> : <LandingPage />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword setToken={setToken} />} />
<Route path="/verify/:token" element={<EmailVerification setToken={setToken} />} />
            
            {/* Clothing Routes */}
            <Route
              path="/clothing"
              element={token ? <ClothingList token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/clothing/add"
              element={token ? <AddClothing token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/clothing/edit/:id"
              element={token ? <EditClothing token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/clothing/calendar"
              element={token ? <ClothingCalendar token={token} /> : <Navigate to="/login" />}
            />

            {/* Outfit Routes */}
            <Route
              path="/outfits"
              element={token ? <OutfitList token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/outfits/create"
              element={token ? <CreateOutfit token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/outfits/edit/:id"
              element={token ? <EditOutfit token={token} /> : <Navigate to="/login" />}
            />

            {/* Other Pages */}
            <Route
              path="/analytics"
              element={token ? <Analytics token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/weather"
              element={token ? <WeatherSuggestions token={token} /> : <Navigate to="/login" />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Wardrobe Manager. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
