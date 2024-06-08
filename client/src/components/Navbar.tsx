import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="bg-primaryBackground py-6 px-10 flex justify-between items-center">
        <div className="text-white font-bold md:text-4xl mb-1">CrossClash</div>
        <div className="hidden md:flex space-x-4 mr-14">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 align-bottom hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 relative">
            <button
              onClick={closeMenu}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex flex-col space-y-4 mt-5">
              <a href="#" className="text-gray-800 hover:text-gray-600">
                Home
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600">
                About
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;