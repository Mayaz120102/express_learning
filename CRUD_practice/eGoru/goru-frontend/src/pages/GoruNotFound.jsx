const GoruNotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 text-xl mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
      >
        Go Home
      </Link>
    </div>
  );
};

export default GoruNotFound;
