import { Link, useNavigate } from "react-router-dom";
import useGoruAuth from "../../hooks/userGoruAuth";

const GoruNavbar = () => {
  const { isAuthenticated, goruUser, goruLogout } = useGoruAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    goruLogout();
    navigate("/");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          🐄 E-Goru
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-green-200 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-green-200 transition">
            About
          </Link>
          <Link to="/cows" className="hover:text-green-200 transition">
            Browse Cows
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-green-200 text-sm">
                👤 {goruUser?.name}
              </span>
              {goruUser?.role === "seller" && (
                <Link
                  to="/dashboard"
                  className="hover:text-green-200 transition"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GoruNavbar;
