import React, { useEffect } from 'react';
import { X, ExternalLink, Sparkles, Brain, Copy, CheckCircle, Share2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const SentimentBadge = ({ sentiment }) => {
  const sentimentConfig = {
    POSITIVE: {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: '🟢'
    },
    NEGATIVE: {
      gradient: 'from-red-500 to-pink-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: '🔴'
    },
    NEUTRAL: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: '🔵'
    }
  };

  const config = sentimentConfig[sentiment] || sentimentConfig.NEUTRAL;

  return (
    <div className={`inline-flex items-center gap-2 backdrop-blur-sm ${config.bg} ${config.border} border rounded-2xl px-4 py-2`}>
      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}></div>
      <span className={`text-sm font-semibold ${config.text} uppercase tracking-wide`}>
        {sentiment}
      </span>
    </div>
  );
};

const SummaryModal = ({ isOpen, onClose, summary, sentiment, articleUrl }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Summary',
          text: summary,
          url: articleUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy
      handleCopySummary();
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop with blur
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform animate-scale-in"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Summary</h2>
              <p className="text-purple-100 text-sm">Powered by SmartBrief AI</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Sentiment Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Article Sentiment
              </h3>
            </div>
            <SentimentBadge sentiment={sentiment} />
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                   Summary
                </h3>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopySummary}
                  className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-105 group"
                  title="Copy Summary"
                >
                  {isCopied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-105 group"
                  title="Share Summary"
                >
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Summary Text */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <p className="text-slate-700 leading-relaxed text-lg font-medium">
                {summary}
              </p>
            </div>

            {/* Copy Success Message */}
            {isCopied && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl p-3 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Summary copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              This summary was generated by SmartBrief and may not capture all nuances
            </p>
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Read Original Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;