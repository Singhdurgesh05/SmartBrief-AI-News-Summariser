import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Brain, ArrowRight, User, CheckCircle, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    password2: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ 
    email: false, 
    password: false, 
    password2: false 
  });
  const { register } = useAuth();

  const { email, password, password2 } = formData;

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
    
    // Validation
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const passwordStrength = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side - Brand & Benefits */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Brand Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 animate-pulse"></div>
              <Brain className="relative w-10 h-10 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SmartBrief
            </span>
          </div>
          
          <div className="mt-20">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Join <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SmartBrief</span> Today
            </h1>
            <p className="text-xl text-gray-300 max-w-md mb-12">
              Start your journey with AI-powered news insights and personalized content delivery.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Powered Summaries</h3>
                  <p className="text-gray-400 text-sm">Get smart briefs in seconds</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Personalized Feed</h3>
                  <p className="text-gray-400 text-sm">Content tailored to your interests</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Real-time Updates</h3>
                  <p className="text-gray-400 text-sm">Stay informed instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-gray-400 text-sm">
            Join thousands of informed users worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-12">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75"></div>
                <Brain className="relative w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SmartBrief</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">
                Join SmartBrief and start your intelligent news journey
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
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
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-opacity duration-300 ${
                    isFocused.email ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-30 blur-sm`}></div>
                  <div className="relative bg-gray-900/50 rounded-xl border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
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
                      className="w-full bg-transparent text-white rounded-xl p-4 pl-12 pr-4 focus:outline-none placeholder-gray-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-opacity duration-300 ${
                    isFocused.password ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-30 blur-sm`}></div>
                  <div className="relative bg-gray-900/50 rounded-xl border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
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
                      placeholder="Create a strong password"
                      className="w-full bg-transparent text-white rounded-xl p-4 pl-12 pr-12 focus:outline-none placeholder-gray-500 transition-all duration-300"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Password strength</span>
                      <span className={`font-medium ${
                        strengthScore >= 4 ? 'text-green-400' : 
                        strengthScore >= 3 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {strengthScore >= 4 ? 'Strong' : strengthScore >= 3 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          strengthScore >= 4 ? 'bg-green-500' : 
                          strengthScore >= 3 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                      <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-400' : ''}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordStrength.length ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                        6+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-green-400' : ''}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordStrength.uppercase ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                        Uppercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.lowercase ? 'text-green-400' : ''}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordStrength.lowercase ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                        Lowercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-green-400' : ''}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordStrength.number ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                        Number
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-opacity duration-300 ${
                    isFocused.password2 ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-30 blur-sm`}></div>
                  <div className="relative bg-gray-900/50 rounded-xl border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-400">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      name="password2"
                      value={password2}
                      onChange={onChange}
                      onFocus={() => onFocus('password2')}
                      onBlur={() => onBlur('password2')}
                      placeholder="Confirm your password"
                      className="w-full bg-transparent text-white rounded-xl p-4 pl-12 pr-4 focus:outline-none placeholder-gray-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                {password2 && password !== password2 && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    required
                  />
                </div>
                <label className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl p-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <span className="px-4 text-gray-400 text-sm">Already have an account?</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl p-4 transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 group"
              >
                <User className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                Sign in to existing account
              </Link>
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;