import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import StatCard from '../components/StatCard';
import CategoryCard from '../components/CategoryCard';
import QuickStatsSection from '../components/QuickStatsSection';
import Spinner from '../components/Spinner';
import {
  FileText,
  TrendingUp,
  Cpu,
  DollarSign,
  Activity,
  Heart,
  RefreshCw
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh dashboard data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchDashboardData(true); // Pass true to indicate background refresh
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchDashboardData = async (isBackgroundRefresh = false, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    try {
      // Only show loading spinner on initial load, not on background refreshes
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      const response = await api.get('/articles/analytics');
      setAnalytics(response.data);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchDashboardData(isBackgroundRefresh, retryCount + 1);
      }

      // Only show error on initial load, silently fail on background refresh
      if (!isBackgroundRefresh) {
        const errorMessage = err.response?.data?.message || 'Failed to load dashboard data. Please try again.';
        setError(errorMessage);
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData(true);
    setIsRefreshing(false);
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => fetchDashboardData(false)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const { summary, quickStats, categoryAnalytics } = analytics;

  const getCategoryIcon = (category) => {
    const icons = {
      technology: <Cpu size={28} className="text-purple-400" />,
      business: <DollarSign size={28} className="text-green-400" />,
      health: <Heart size={28} className="text-red-400" />,
      science: <Activity size={28} className="text-pink-400" />
    };
    return icons[category] || <FileText size={28} className="text-blue-400" />;
  };

  const getCategoryTitle = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] -mx-4 -my-8 px-4 py-8 sm:-mx-6 lg:-mx-8">
      <div className="container mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Good Morning, {user?.email?.split('@')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Here's your summarized news digest.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-400 text-sm">
                Updated {getTimeAgo(lastUpdated)}
              </span>
            )}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<FileText size={28} className="text-purple-400" />}
            title="Articles Summarized Today"
            value={summary.articlesAddedToday}
            subtitle={`${summary.changeFromYesterday >= 0 ? '+' : ''}${summary.changeFromYesterday} more than yesterday`}
            trend={summary.changeFromYesterday > 0 ? `${Math.round((summary.changeFromYesterday / (summary.articlesAddedToday || 1)) * 100)}%` : null}
            gradient="bg-gradient-to-br from-purple-900 to-purple-700"
          />
          <StatCard
            icon={<TrendingUp size={28} className="text-pink-400" />}
            title="Sentiment Analysis"
            value={`${summary.sentimentOverview.positivePercent}% Positive`}
            subtitle={`${summary.sentimentOverview.negativePercent}% Negative`}
            trend={summary.sentimentOverview.positivePercent > 50 ? `${summary.sentimentOverview.positivePercent - 50}%` : null}
            gradient="bg-gradient-to-br from-pink-900 to-pink-700"
          />
        </div>

        {/* Trending Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trending Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryAnalytics.map((category, index) => (
              <CategoryCard
                key={index}
                icon={getCategoryIcon(category.category)}
                title={getCategoryTitle(category.category)}
                articleCount={category.articleCount}
                sentiments={category.sentiments}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStatsSection stats={quickStats} />
      </div>
    </div>
  );
};

export default DashboardPage;
