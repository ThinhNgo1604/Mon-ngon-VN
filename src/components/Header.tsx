import { useState } from 'react';
import { Search, LogIn, LogOut, UtensilsCrossed, Plus } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion } from 'motion/react';

interface HeaderProps {
  user: any;
  onSearch: (query: string) => void;
}

export default function Header({ user, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed:', error);
      alert('Đăng nhập thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-brand-red p-2 rounded-lg">
              <UtensilsCrossed className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">
              Món ngon <span className="text-brand-red">VN</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-warm-bg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm transition-all"
                placeholder="Tìm cửa hàng hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-brand-red transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-brand-red hover:bg-red-700 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
