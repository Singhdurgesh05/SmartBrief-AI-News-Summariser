import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SavedArticleCard from '../components/SavedArticleCard';
import Spinner from '../components/Spinner';
import SummaryModal from '../components/SummaryModal';
import { BookmarkCheck, Search, X, Filter, Sparkles, BookOpen, Trash2, RefreshCw } from 'lucide-react';

const SavedArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({ isOpen: false, summary: '', sentiment: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySentiment, setFilterBySentiment] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  useEffect(() => {
    let filtered = [...articles];

    if (filterBySentiment !== 'all') {
      filtered = filtered.filter(article =>
        article.sentiment?.toUpperCase() === filterBySentiment
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query) ||
        article.source?.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  }, [searchQuery, articles, filterBySentiment]);

  const fetchSavedArticles = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await api.get('/articles/saved');
      setArticles(res.data);
      setFilteredArticles(res.data);
    } catch (err) {
      console.error('Error fetching saved articles:', err);
      setError('Failed to load saved articles. Please try again later.');
    }
    if (!isBackgroundRefresh) {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSavedArticles(true);
    
    // Show success notification
    const tempSuccess = document.createElement('div');
    tempSuccess.className = 'fixed top-20 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-green-400/20';
    tempSuccess.innerHTML = `
      <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </div>
      <span class="font-medium">Articles refreshed!</span>
    `;
    document.body.appendChild(tempSuccess);
    setTimeout(() => {
      tempSuccess.classList.add('animate-fade-out');
      setTimeout(() => tempSuccess.remove(), 300);
    }, 3000);
    
    setIsRefreshing(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterBySentiment('all');
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await api.delete(`/articles/${articleId}`);
      setArticles(articles.filter(a => a._id !== articleId));
      
      // Show delete success notification
      const tempSuccess = document.createElement('div');
      tempSuccess.className = 'fixed top-20 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-blue-400/20';
      tempSuccess.innerHTML = `
        <Trash2 class="w-5 h-5 text-white/90" />
        <span class="font-medium">Article deleted successfully!</span>
      `;
      document.body.appendChild(tempSuccess);
      setTimeout(() => {
        tempSuccess.classList.add('animate-fade-out');
        setTimeout(() => tempSuccess.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error('Error deleting article:', err);
      
      const tempError = document.createElement('div');
      tempError.className = 'fixed top-20 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-red-400/20';
      tempError.innerHTML = `
        <svg class="w-5 h-5 text-white/90" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">Failed to delete article</span>
      `;
      document.body.appendChild(tempError);
      setTimeout(() => {
        tempError.classList.add('animate-fade-out');
        setTimeout(() => tempError.remove(), 300);
      }, 4000);
    }
  };

  const handleResummarize = async (article) => {
    setLoading(true);
    try {
      const res = await api.post('/articles/summarize', { articleUrl: article.url });

      await api.put(`/articles/resummarize/${article._id}`, {
        summary: res.data.summary,
        sentiment: res.data.sentiment,
      });

      setArticles(articles.map(a =>
        a._id === article._id
          ? { ...a, summary: res.data.summary, sentiment: res.data.sentiment }
          : a
      ));

      setModalData({
        isOpen: true,
        summary: res.data.summary,
        sentiment: res.data.sentiment,
        url: article.url
      });

      // Show success notification
      const tempSuccess = document.createElement('div');
      tempSuccess.className = 'fixed top-20 right-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-purple-400/20';
      tempSuccess.innerHTML = `
        <Sparkles class="w-5 h-5 text-white/90" />
        <span class="font-medium">Article re-summarized with AI!</span>
      `;
      document.body.appendChild(tempSuccess);
      setTimeout(() => {
        tempSuccess.classList.add('animate-fade-out');
        setTimeout(() => tempSuccess.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error('Error re-summarizing article:', err);
      setError('Failed to re-summarize article.');
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setModalData({ isOpen: false, summary: '', sentiment: '', url: '' });
  };

  const getSentimentStats = () => {
    const stats = {
      POSITIVE: articles.filter(a => a.sentiment === 'POSITIVE').length,
      NEGATIVE: articles.filter(a => a.sentiment === 'NEGATIVE').length,
      NEUTRAL: articles.filter(a => a.sentiment === 'NEUTRAL').length,
    };
    return stats;
  };

  const sentimentStats = getSentimentStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-2xl">
                  <BookmarkCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Saved Articles
                  </h1>
                  <p className="text-slate-600 mt-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Your personal collection of AI-summarized news ({articles.length} total)
                  </p>
                </div>
              </div>

              {/* Sentiment Stats */}
              {articles.length > 0 && (
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      {sentimentStats.POSITIVE} Positive
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      {sentimentStats.NEUTRAL} Neutral
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">
                      {sentimentStats.NEGATIVE} Negative
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="group relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center gap-3">
                <RefreshCw 
                  size={20} 
                  className={`text-slate-700 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
                />
                <span className="font-semibold text-slate-700">
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6 space-y-6">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-5 pointer-events-none"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search by title, summary, or source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder-slate-400 text-slate-700 font-medium relative z-20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 z-30"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Filter by sentiment:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'All', bg: 'bg-slate-600', hover: 'hover:bg-slate-700' },
                  { value: 'POSITIVE', label: 'Positive', bg: 'bg-green-600', hover: 'hover:bg-green-700' },
                  { value: 'NEUTRAL', label: 'Neutral', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                  { value: 'NEGATIVE', label: 'Negative', bg: 'bg-red-600', hover: 'hover:bg-red-700' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterBySentiment(filter.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
                      filterBySentiment === filter.value
                        ? `${filter.bg} shadow-lg`
                        : `bg-slate-400 ${filter.hover}`
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              {(searchQuery || filterBySentiment !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Results count */}
            {(searchQuery || filterBySentiment !== 'all') && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50/50 rounded-lg p-3 border border-slate-200">
                <Search className="w-4 h-4" />
                <span>
                  Showing <strong className="text-slate-800">{filteredArticles.length}</strong> of{' '}
                  <strong className="text-slate-800">{articles.length}</strong> articles
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <BookmarkCheck className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-purple-700 text-lg font-medium">Loading your saved articles...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Unable to load articles</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchSavedArticles()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg flex items-center gap-3 mx-auto"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State - No Articles */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookmarkCheck className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No saved articles yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Start saving articles from the home page to build your personal news collection.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg"
            >
              Browse Articles
            </button>
          </div>
        )}

        {/* Empty State - No Filter Results */}
        {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No articles match your filters</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Try adjusting your search terms or sentiment filters to see more results.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <SavedArticleCard
                  key={article._id}
                  article={article}
                  onDelete={() => handleDelete(article._id)}
                  onResummarize={() => handleResummarize(article)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <SummaryModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        summary={modalData.summary}
        sentiment={modalData.sentiment}
        articleUrl={modalData.url}
      />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default SavedArticlesPage;