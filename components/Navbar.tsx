
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { LogOut, Package, LayoutDashboard, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Package className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">ProManager</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.gender}</span>
              </div>
              <img
                src={user?.image || 'https://picsum.photos/40/40'}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-200"
              />
              <button
                onClick={handleLogout}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
