import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    }

    const isActive = (path) => location.pathname === path;

    return (
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <Link
                to="/home"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/home') ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/appointments"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/appointments') ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                Appointments
              </Link>
              {userRole === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin') ? 'bg-gray-900' : 'hover:bg-gray-700'
                  }`}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/players"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/players') ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                Players
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
};

export default Navbar; 