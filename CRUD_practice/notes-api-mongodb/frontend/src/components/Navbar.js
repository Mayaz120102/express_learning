import React, { useState } from "react";

const Navbar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4 shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">NotesApp</h1>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-gray-300 truncate max-w-[120px]">
            {user?.name}
          </span>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* Mobile button */}
        <button
          className="sm:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden mt-3 flex flex-col gap-3 bg-gray-800 p-3 rounded">
          <span className="text-sm text-gray-300">
            {user?.name}
          </span>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm w-full"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;