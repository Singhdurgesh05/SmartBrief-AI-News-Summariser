import React, { useState } from 'react';
import { Sparkles, Bookmark, ExternalLink, Clock, Eye, Share2 } from 'lucide-react';

const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

const ImagePlaceholder = ({ source }) => (
  <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    <div className="text-center relative z-10">
      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <Eye className="w-6 h-6 text-white/40" />
      </div>
      <p className="text-white/60 text-sm font-medium">{source?.name || 'News Source'}</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
  </div>
);

const ArticleCard = ({ article, onSummarize, onSave }) => {
  const { title, source, publishedAt, urlToImage, url, description } = article;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    onSave();
    
    // Show save feedback
    const tempFeedback = document.createElement('div');
    tempFeedback.className = 'fixed top-20 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-blue-400/20';
    tempFeedback.innerHTML = `
      <Bookmark class="w-5 h-5 text-white/90 ${isSaved ? 'fill-white' : ''}" />
      <span class="font-medium">${isSaved ? 'Article saved!' : 'Article removed!'}</span>
    `;
    document.body.appendChild(tempFeedback);
    setTimeout(() => {
      tempFeedback.classList.add('animate-fade-out');
      setTimeout(() => tempFeedback.remove(), 300);
    }, 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // copy to clipboard
      navigator.clipboard.writeText(url);
      const tempFeedback = document.createElement('div');
      tempFeedback.className = 'fixed top-20 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-green-400/20';
      tempFeedback.innerHTML = `
        <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="font-medium">Link copied to clipboard!</span>
      `;
      document.body.appendChild(tempFeedback);
      setTimeout(() => {
        tempFeedback.classList.add('animate-fade-out');
        setTimeout(() => tempFeedback.remove(), 300);
      }, 3000);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden h-full flex flex-col border border-slate-200">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
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
        
        {/* Source Badge */}
        <div className="absolute top-4 left-4 backdrop-blur-sm bg-black/60 border border-white/20 rounded-xl px-3 py-1.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wide">
            {source?.name || 'Unknown'}
          </span>
        </div>
        
        {/* Time Badge */}
        <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/60 border border-white/20 rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-xs font-medium text-white">
              {getTimeAgo(publishedAt)}
            </span>
          </div>
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
        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-slate-900 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <div className="mb-4 flex-grow">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3" title={description}>
            {description || 'No description available.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <button 
            onClick={onSummarize}
            className="flex-1 group/btn bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
             Summarize
          </button>
          
          <div className="flex gap-1">
            <button 
              onClick={handleSaveClick}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/save ${
                isSaved 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save article'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/link"
              title="Read Original Article"
            >
              <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
            </a>

            <button 
              onClick={handleShare}
              className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/share"
              title="Share Article"
            >
              <Share2 className="w-4 h-4 group-hover/share:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ArticleCard;