import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Brain, BookmarkCheck, LogOut, Menu, X, BarChart3, Newspaper, User, ChevronDown, Sparkles, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const emailName = user.email.split('@')[0];
    return emailName.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/news', label: 'News Feed', icon: Newspaper },
    { path: '/saved', label: 'Saved Articles', icon: BookmarkCheck },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-slate-200/50' 
          : 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 lg:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-500 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20'
                }`}>
                  <Brain className={`w-6 h-6 transition-colors duration-500 ${
                    isScrolled ? 'text-white' : 'text-purple-300'
                  }`} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-500 ${
                    isScrolled ? 'text-xl' : 'text-2xl'
                  }`}>
                    SmartBrief
                  </span>
                  {!isScrolled && (
                    <span className="text-xs text-purple-300 font-medium mt-0.5">Cognitive News Engine</span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {user && (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isActive(item.path)
                            ? isScrolled
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                              : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                            : isScrolled
                            ? 'text-slate-700 hover:text-purple-600 hover:bg-slate-100'
                            : 'text-purple-200 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-5 h-5 transition-colors duration-300 ${
                          isActive(item.path) 
                            ? 'text-current' 
                            : isScrolled 
                              ? 'text-slate-500 group-hover:text-purple-500' 
                              : 'text-purple-300 group-hover:text-white'
                        }`} />
                        <span>{item.label}</span>
                        
                        {/* Active indicator */}
                        {isActive(item.path) && (
                          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 rounded-full ${
                            isScrolled ? 'bg-white' : 'bg-purple-400'
                          }`}></div>
                        )}
                      </Link>
                    );
                  })}

                  {/* Profile Dropdown */}
                  <div className="relative ml-2" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'hover:bg-slate-100 text-slate-700' 
                          : 'hover:bg-white/10 text-purple-200'
                      }`}
                    >
                      <div className={`relative transition-all duration-500 ${
                        isScrolled 
                          ? 'w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg' 
                          : 'w-9 h-9 bg-gradient-to-r from-purple-400 to-pink-500 border border-white/20'
                      } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {getUserInitials()}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      } ${isScrolled ? 'text-slate-500' : 'text-purple-300'}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl py-3 z-50 ${
                        isScrolled
                          ? 'bg-white/95 border-slate-200'
                          : 'bg-slate-800/95 border-white/20'
                      }`}>
                        {/* User Info */}
                        <div className={`px-4 py-3 border-b ${
                          isScrolled ? 'border-slate-200' : 'border-white/20'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {getUserInitials()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate text-white">
                                {user.email?.split('@')[0]}
                              </p>
                              <p className={`text-xs truncate ${
                                isScrolled ? 'text-slate-500' : 'text-purple-300'
                              }`}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('/profile');
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                              isScrolled
                                ? 'text-slate-700 hover:text-purple-600 hover:bg-slate-100'
                                : 'text-purple-200 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('/settings');
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                              isScrolled
                                ? 'text-slate-700 hover:text-purple-600 hover:bg-slate-100'
                                : 'text-purple-200 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Settings className="w-4 h-4" />
                            Preferences
                          </button>
                          <div className={`mx-4 my-2 h-px ${
                            isScrolled ? 'bg-slate-200' : 'bg-white/20'
                          }`}></div>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                              isScrolled
                                ? 'text-red-600 hover:text-white bg-red-50 hover:bg-red-500'
                                : 'text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/30'
                            }`}
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-slate-700 hover:bg-slate-100' 
                    : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div className={`lg:hidden border-t backdrop-blur-xl ${
            isScrolled
              ? 'bg-white/95 border-slate-200'
              : 'bg-slate-800/95 border-white/20'
          }`}>
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? isScrolled
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                          : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                        : isScrolled
                        ? 'text-slate-700 hover:text-purple-600 hover:bg-slate-100'
                        : 'text-purple-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* User Section */}
              <div className={`pt-4 mt-4 border-t ${
                isScrolled ? 'border-slate-200' : 'border-white/20'
              }`}>
                <div className={`px-4 py-3 rounded-xl mb-3 ${
                  isScrolled ? 'bg-slate-100' : 'bg-white/5'
                }`}>
                  <p className={`text-sm font-semibold ${
                    isScrolled ? 'text-slate-800' : 'text-white'
                  }`}>
                    {user.email?.split('@')[0]}
                  </p>
                  <p className={`text-xs ${
                    isScrolled ? 'text-slate-500' : 'text-purple-300'
                  } truncate`}>
                    {user.email}
                  </p>
                </div>
                
                {/* Fixed Logout Button - No overflow */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isScrolled
                      ? 'text-red-600 hover:text-white bg-red-50 hover:bg-red-500'
                      : 'text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/30'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;