import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMobileMenu}>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg shadow-lg transform group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-white rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-white text-xl sm:text-2xl font-bold tracking-tight group-hover:text-yellow-200 transition">
                  Formlix
                </span>
                <span className="text-blue-100 text-[10px] sm:text-xs font-medium -mt-1 hidden sm:block">
                  Smart Reports
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/generate-report"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Generate Report
                </Link>
                <Link
                  to="/generate-from-content"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  From Content
                </Link>
                <Link
                  to="/feedback"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Feedback
                </Link>
                <span className="text-white font-medium text-sm truncate max-w-[120px]">
                  👤 {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-md transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white border-opacity-20 mt-2">
            <div className="flex flex-col space-y-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    🏠 Home
                  </Link>
                  <Link
                    to="/generate-report"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    📝 Generate Report
                  </Link>
                  <Link
                    to="/generate-from-content"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    📄 From Content
                  </Link>
                  <Link
                    to="/feedback"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    💬 Feedback
                  </Link>
                  <div className="text-white px-4 py-2 text-sm font-medium border-t border-white border-opacity-20 mt-2 pt-4">
                    👤 {user?.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition mx-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    🏠 Home
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2.5 rounded-md text-sm font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2.5 rounded-md text-sm font-medium transition mx-4"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;