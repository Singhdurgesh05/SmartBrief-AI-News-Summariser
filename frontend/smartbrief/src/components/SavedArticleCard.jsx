import React, { useState } from 'react';
import { RefreshCw, Trash2, ExternalLink, Bookmark, Clock, Eye, Sparkles } from 'lucide-react';

const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

const getTimeAgo = (dateString) => {
  try {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
  } catch (e) {
    return dateString;
  }
};

const SentimentBadge = ({ sentiment }) => {
  const sentimentConfig = {
    POSITIVE: {
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: '🟢'
    },
    NEGATIVE: {
      color: 'from-red-500 to-pink-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: '🔴'
    },
    NEUTRAL: {
      color: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: '🔵'
    }
  };

  const config = sentimentConfig[sentiment] || sentimentConfig.NEUTRAL;

  return (
    <div className={`absolute top-4 right-4 backdrop-blur-sm ${config.bg} ${config.border} border rounded-2xl px-3 py-1.5`}>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`}></div>
        <span className={`text-xs font-semibold ${config.text} uppercase tracking-wide`}>
          {sentiment}
        </span>
      </div>
    </div>
  );
};

const ImagePlaceholder = ({ source }) => (
  <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    <div className="text-center relative z-10">
      <Bookmark className="w-12 h-12 text-white/40 mx-auto mb-2" />
      <p className="text-white/60 text-sm font-medium">{source}</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
  </div>
);

const SavedArticleCard = ({ article, onDelete, onResummarize }) => {
  const { title, source, publishedAt, urlToImage, url, sentiment, summary } = article;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden h-full flex flex-col shadow-lg">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 animate-pulse"></div>
            )}
            <img
              src={urlToImage}
              alt={title}
              className={`w-full h-48 object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } group-hover:scale-105`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <ImagePlaceholder source={source} />
        )}
        
        {/* Sentiment Badge */}
        <SentimentBadge sentiment={sentiment} />
        
        {/* Source Badge */}
        <div className="absolute top-4 left-4 backdrop-blur-sm bg-black/60 border border-white/20 rounded-xl px-3 py-1.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wide">
            {source}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2 leading-tight group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center text-sm text-slate-400 mb-4 gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
          <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>Saved</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 flex-grow">
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3" title={summary}>
            {summary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-600/30">
          <button 
            onClick={onResummarize}
            className="flex-1 group/btn bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
            Re-summarize
          </button>
          
          <div className="flex gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/link"
              title="Read Original Article"
            >
              <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
            </a>
            
            <button 
              onClick={onDelete}
              className="p-3 bg-slate-700/50 hover:bg-red-500/20 border border-slate-600 hover:border-red-500/30 text-slate-300 hover:text-red-400 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/delete"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default SavedArticleCard;