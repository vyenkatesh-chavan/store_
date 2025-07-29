import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const auth = localStorage.getItem("token");
  const vendorAuth = localStorage.getItem("vendorToken");
  const isLoggedIn = auth || vendorAuth;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const renderProfileLink = () => {
    if (vendorAuth) {
      return <Link to="/vendorprofile" className="text-white hover:text-cyan-300">Vendor Profile</Link>;
    } else if (auth) {
      return <Link to="/profile" className="text-white hover:text-cyan-300">Customer Profile</Link>;
    }
    return null;
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white text-xl font-bold tracking-wider">
            <Link to="/" className="hover:text-cyan-400 transition-colors duration-300">
              Open Store
            </Link>
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 text-sm">
            <li>
              <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </li>
            {vendorAuth && (
  <li>
    <Link to="/add-product" className="text-white hover:text-cyan-300">
      Add Product
    </Link>
  </li>
)}

            {isLoggedIn ? (
              <>
                <li>{renderProfileLink()}</li>
                <li>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/logincustomer" className="text-gray-300 hover:text-white">Customer Login</Link>
                </li>
                <li>
                  <Link to="/loginvendor" className="text-gray-300 hover:text-white">Vendor Login</Link>
                </li>
                <li>
                  <Link to="/signupcustomer" className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/signupvendor" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
                    Sell with Us
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <ul className="flex flex-col space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li>{renderProfileLink()}</li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-500"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/logincustomer" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Customer Login</Link>
                  </li>
                  <li>
                    <Link to="/loginvendor" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Vendor Login</Link>
                  </li>
                  <li>
                    <Link to="/signupcustomer" className="bg-cyan-600 text-white px-3 py-1 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/signupvendor" className="bg-green-600 text-white px-3 py-1 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>Sell with Us</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
