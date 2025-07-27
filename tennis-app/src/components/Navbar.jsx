import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        setIsLoggedIn(!!role);
    }, [location]); // Update on route change

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
        setIsMenuOpen(false);
    }

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/home" className="text-white font-bold text-lg">
                Tenis Centar Krstulović
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-1">
                <Link
                  to="/home"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/home') 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                
                {/* Appointments link visible to all */}
                <Link
                  to="/appointments"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/appointments') 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Appointments
                </Link>

                {isLoggedIn && (
                  <>
                    <Link
                      to="/players"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/players') 
                          ? 'bg-blue-700 text-white' 
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`}
                    >
                      Players
                    </Link>
                    {userRole === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive('/admin') 
                            ? 'bg-blue-700 text-white' 
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/20 text-white rounded-md text-sm font-medium hover:bg-white/30 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white/20 text-white rounded-md text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-white/30 text-white rounded-md text-sm font-medium hover:bg-white/40 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/home"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/home') 
                    ? 'bg-blue-700 text-white' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                Home
              </Link>
              
              {/* Appointments link visible to all */}
              <Link
                to="/appointments"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/appointments') 
                    ? 'bg-blue-700 text-white' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                Appointments
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/players"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/players') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-700'
                    }`}
                  >
                    Players
                  </Link>
                  {userRole === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin') 
                          ? 'bg-blue-700 text-white' 
                          : 'text-white hover:bg-blue-700'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/register') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-700'
                    }`}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/login') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-700'
                    }`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
};

export default Navbar;