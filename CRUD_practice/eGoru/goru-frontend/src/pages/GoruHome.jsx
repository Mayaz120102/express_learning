import { Link } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";

const GoruHome = () => {
  const { isAuthenticated, goruUser } = userGoruAuth();

  return (
    <div>
      {/* Hero section */}
      <div className="text-center py-20 px-4">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          🎉 Eid-ul-Adha Special Marketplace
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Buy & Sell Cows <br />
          <span className="text-green-700">Online in Bangladesh</span>
        </h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-10">
          E-Goru connects buyers and sellers across Bangladesh. Browse verified
          listings, safe transactions, doorstep delivery.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cows"
            className="bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-800 transition text-lg"
          >
            Browse Cows
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="border-2 border-green-700 text-green-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-green-50 transition text-lg"
            >
              Start Selling
            </Link>
          )}
          {isAuthenticated && goruUser?.role === "seller" && (
            <Link
              to="/cows/add"
              className="border-2 border-green-700 text-green-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-green-50 transition text-lg"
            >
              + List Your Cow
            </Link>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition border-t-4 border-green-500">
          <div className="text-4xl mb-3">🐄</div>
          <h2 className="text-xl font-semibold mb-2">Browse Cows</h2>
          <p className="text-gray-600">
            Explore a wide variety of healthy and verified cows from sellers
            across Bangladesh.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition border-t-4 border-yellow-500">
          <div className="text-4xl mb-3">💰</div>
          <h2 className="text-xl font-semibold mb-2">Sell Your Cow</h2>
          <p className="text-gray-600">
            Easily list your cows and reach thousands of potential buyers
            nationwide.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition border-t-4 border-blue-500">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Safe Transactions</h2>
          <p className="text-gray-600">
            Secure and trusted system for smooth cattle trading experience.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-green-700 text-white rounded-2xl p-8 mt-12 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold">500+</p>
          <p className="text-green-200 text-sm mt-1">Cows Listed</p>
        </div>
        <div>
          <p className="text-3xl font-bold">64</p>
          <p className="text-green-200 text-sm mt-1">Districts Covered</p>
        </div>
        <div>
          <p className="text-3xl font-bold">1000+</p>
          <p className="text-green-200 text-sm mt-1">Happy Customers</p>
        </div>
      </div>
    </div>
  );
};

export default GoruHome;
