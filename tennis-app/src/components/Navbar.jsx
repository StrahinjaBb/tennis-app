import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
    }

    const isActive = (path) => location.pathname === path;

    return (
      <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation links */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-center space-x-1">
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
                </div>
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {username && (
                  <span className="text-blue-100 text-sm font-medium">
                    Welcome, {username}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/20 text-white rounded-md text-sm font-medium hover:bg-white/30 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/home"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/home') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/appointments"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/appointments') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Appointments
            </Link>
            <Link
              to="/players"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
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
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin') 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;