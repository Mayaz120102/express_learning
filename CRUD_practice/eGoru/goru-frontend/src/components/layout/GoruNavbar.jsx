import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userGoruAuth from "../../hooks/userGoruAuth";
import toast from "react-hot-toast";

const GoruNavbar = () => {
  const { isAuthenticated, goruUser, goruLogout } = userGoruAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    goruLogout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="hover:text-green-200 transition"
      >
        Home
      </Link>
      <Link
        to="/cows"
        onClick={() => setMenuOpen(false)}
        className="hover:text-green-200 transition"
      >
        Browse Cows
      </Link>
      <Link
        to="/about"
        onClick={() => setMenuOpen(false)}
        className="hover:text-green-200 transition"
      >
        About
      </Link>

      {isAuthenticated ? (
        <>
          {goruUser?.role === "buyer" && (
            <Link
              to="/my-orders"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-200 transition"
            >
              My Orders
            </Link>
          )}
          {(goruUser?.role === "seller" || goruUser?.role === "admin") && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-200 transition"
            >
              Dashboard
            </Link>
          )}
          <span className="text-green-200 text-sm hidden md:inline">
            👤 {goruUser?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="hover:text-green-200 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition"
          >
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            🐄 E-Goru
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">{navLinks}</div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 pt-4 pb-2 border-t border-green-600 mt-3">
            {navLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

export default GoruNavbar;
