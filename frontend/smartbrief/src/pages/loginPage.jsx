import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Brain, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const onBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Brand Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <Brain className="w-10 h-10 text-blue-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SmartBrief
            </span>
          </div>
          
          <div className="mt-20">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Welcome back to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SmartBrief</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Continue your journey with AI-powered insights and intelligent content analysis.
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-gray-400 text-sm">
            © 2024 SmartBrief. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/5 backdrop-blur-sm border-l border-white/10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-12">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">SmartBrief</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-opacity ${
                    isFocused.email ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-100 blur-sm`}></div>
                  <div className="relative bg-gray-900 rounded-xl border border-gray-700 group-hover:border-gray-600 transition-colors">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      onFocus={() => onFocus('email')}
                      onBlur={() => onBlur('email')}
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-white rounded-xl p-4 pl-12 pr-4 focus:outline-none placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-opacity ${
                    isFocused.password ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-100 blur-sm`}></div>
                  <div className="relative bg-gray-900 rounded-xl border border-gray-700 group-hover:border-gray-600 transition-colors">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-400">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={onChange}
                      onFocus={() => onFocus('password')}
                      onBlur={() => onBlur('password')}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-white rounded-xl p-4 pl-12 pr-12 focus:outline-none placeholder-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl p-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group"
                >
                  Sign Up
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden text-center mt-8">
            <p className="text-gray-400 text-sm">
              © 2024 SmartBrief. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;