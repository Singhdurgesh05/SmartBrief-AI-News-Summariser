import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import ArticleCard from '../components/ArticleCard';
import Spinner from '../components/Spinner';
import SummaryModal from '../components/SummaryModal';
import { Search, X, RefreshCw, Filter, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [modalData, setModalData] = useState({ isOpen: false, summary: '', sentiment: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('category');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchMode === 'category') {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory, searchMode]);

  useEffect(() => {
    if (searchMode === 'category') {
      if (searchQuery.trim() === '') {
        setFilteredArticles(articles);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = articles.filter(article =>
          article.title?.toLowerCase().includes(query) ||
          article.description?.toLowerCase().includes(query) ||
          article.source?.name?.toLowerCase().includes(query)
        );
        setFilteredArticles(filtered);
      }
    }
  }, [searchQuery, articles, searchMode]);

  const fetchArticles = async (category, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const refreshParam = forceRefresh ? '&refresh=true' : '';
      const res = await api.get(`/articles/trending?category=${category}${refreshParam}`);
      const articlesData = (res.data || []).filter(a => a && a.urlToImage).slice(0, 20);
      setArticles(articlesData);
      setFilteredArticles(articlesData);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch news. Please try again later.');
    }
    setLoading(false);
  };

  const handleKeywordSearch = async (forceRefresh = false) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search keyword');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchMode('keyword');
    try {
      const refreshParam = forceRefresh ? '&refresh=true' : '';
      const res = await api.get(`/articles/search?q=${encodeURIComponent(searchQuery)}${refreshParam}`);
      const articlesData = (res.data || []).filter(a => a && a.urlToImage).slice(0, 20);
      setArticles(articlesData);
      setFilteredArticles(articlesData);
    } catch (err) {
      console.error('Error searching articles:', err);
      setError('Failed to search articles. Please try again.');
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchMode('category');
    fetchArticles(selectedCategory);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError('');
    try {
      if (searchMode === 'keyword') {
        await handleKeywordSearch(true);
      } else {
        await fetchArticles(selectedCategory, true);
      }
      
      // Enhanced success notification
      const tempSuccess = document.createElement('div');
      tempSuccess.className = 'fixed top-20 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-green-400/20';
      tempSuccess.innerHTML = `
        <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="font-medium">Articles refreshed successfully!</span>
      `;
      document.body.appendChild(tempSuccess);
      setTimeout(() => {
        tempSuccess.classList.add('animate-fade-out');
        setTimeout(() => tempSuccess.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error('Refresh failed:', err);
    }
    setIsRefreshing(false);
  };

  const handleSummarize = async (articleUrl) => {
    setLoading(true);
    try {
      const res = await api.post('/articles/summarize', { articleUrl });
      setModalData({
        isOpen: true,
        summary: res.data.summary,
        sentiment: res.data.sentiment,
        url: articleUrl
      });
    } catch (err) {
      console.error('Error summarizing article:', err);
      setError('Failed to summarize. The article may be behind a paywall.');
    }
    setLoading(false);
  };
  
  const handleSave = async (article) => {
    try {
      const summaryRes = await api.post('/articles/summarize', { articleUrl: article.url });
      
      const articleToSave = {
        title: article.title,
        source: article.source.name,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        summary: summaryRes.data.summary,
        sentiment: summaryRes.data.sentiment,
      };
      
      await api.post('/articles/save', articleToSave);
      
      // Enhanced save notification - centered
      const tempSuccess = document.createElement('div');
      tempSuccess.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in flex items-center gap-3 backdrop-blur-sm border border-green-400/20';
      tempSuccess.innerHTML = `
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="font-semibold text-lg">Article saved successfully!</span>
      `;
      document.body.appendChild(tempSuccess);
      setTimeout(() => {
        tempSuccess.classList.add('animate-fade-out');
        setTimeout(() => tempSuccess.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error('Error saving article:', err);
      let errorMessage = 'Failed to save article.';
      if (err.response && err.response.status === 401) {
        errorMessage = 'Please log in to save articles.';
      } else if (err.response && err.response.data.msg === 'Article already saved') {
        errorMessage = 'You have already saved this article.';
      }
      
      const tempError = document.createElement('div');
      tempError.className = 'fixed top-20 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-red-400/20';
      tempError.innerHTML = `
        <svg class="w-5 h-5 text-white/90" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">${errorMessage}</span>
      `;
      document.body.appendChild(tempError);
      setTimeout(() => {
        tempError.classList.add('animate-fade-out');
        setTimeout(() => tempError.remove(), 300);
      }, 4000);
    }
  };

  const handleCloseModal = () => {
    setModalData({ isOpen: false, summary: '', sentiment: '', url: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    SmartBrief Feed
                  </h1>
                  <p className="text-slate-600 mt-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                      Insight news from around the world
                  </p>
                </div>
              </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-5 pointer-events-none"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search news by topic, keyword, or source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleKeywordSearch()}
                  className="w-full pl-12 pr-12 py-4 bg-transparent border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder-slate-400 text-slate-700 font-medium relative z-20"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 z-30"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleKeywordSearch}
                  disabled={!searchQuery.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3 shadow-lg"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
                
                {/* Filter Toggle for Mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {searchMode === 'keyword' && searchQuery && (
              <div className="mt-4 flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Search className="w-4 h-4" />
                  <span>Showing results for: <strong className="font-semibold">{searchQuery}</strong></span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} transition-all duration-300`}>
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && <Spinner />}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 text-center shadow-lg mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load articles</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No articles found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchMode === 'keyword' 
                ? `No results found for "${searchQuery}". Try a different search term or browse by category.`
                : 'Try selecting a different category or using the search feature.'
              }
            </p>
            {searchMode === 'keyword' && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
              >
                Browse All Categories
              </button>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {searchMode === 'keyword' ? 'Search Results' : 'Trending News'}
                <span className="text-slate-500 text-lg font-normal ml-2">
                  ({filteredArticles.length} articles)
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={`${article.url}-${index}`}
                  article={article}
                  onSummarize={() => handleSummarize(article.url)}
                  onSave={() => handleSave(article)}
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

export default HomePage;