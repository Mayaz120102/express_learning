const GoruHome = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-green-700 mb-4">
        🐄 Welcome to E-Goru
      </h1>
      <p className="text-gray-600 text-xl">
        Bangladesh's modern cattle marketplace for Eid-ul-Adha
      </p>
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
          <div className="text-4xl mb-3">🐄</div>
          <h2 className="text-xl font-semibold mb-2">Browse Cows</h2>
          <p className="text-gray-600">
            Explore a wide variety of healthy and verified cows from sellers.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
          <div className="text-4xl mb-3">💰</div>
          <h2 className="text-xl font-semibold mb-2">Sell Your Cow</h2>
          <p className="text-gray-600">
            Easily list your cows and reach thousands of potential buyers.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Safe Transactions</h2>
          <p className="text-gray-600">
            Secure payment and trusted system for smooth trading experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoruHome;
