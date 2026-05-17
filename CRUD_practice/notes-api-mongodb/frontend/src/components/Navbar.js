import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">NotesApp</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{user?.name}</span>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
