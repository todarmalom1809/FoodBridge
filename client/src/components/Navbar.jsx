import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardPath = user?.role === 'donor' ? '/donor' : user?.role === 'ngo' ? '/ngo' : '/org';

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
          <Leaf className="w-6 h-6" />
          FoodBridge
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={dashboardPath} className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-700">
                <User className="w-4 h-4" /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-green-700">Login</Link>
              <Link to="/register" className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
