import React from 'react';
import { TrendingUp, Sparkles, Activity } from 'lucide-react';

const CategoryCard = ({ icon, title, articleCount, sentiments, gradient = "from-purple-900/50 to-purple-700/50", border = "border-purple-500/20" }) => {
  const { positive = 0, neutral = 0, negative = 0 } = sentiments;
  
  // Calculate dominant sentiment
  const dominantSentiment = positive >= neutral && positive >= negative ? 'positive' : 
                           neutral >= positive && neutral >= negative ? 'neutral' : 'negative';

  const sentimentConfig = {
    positive: {
      color: 'from-green-500 to-emerald-600',
      text: 'text-green-400',
      bg: 'bg-green-500/20',
      icon: '🟢'
    },
    neutral: {
      color: 'from-blue-500 to-cyan-600',
      text: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: '🔵'
    },
    negative: {
      color: 'from-red-500 to-pink-600',
      text: 'text-red-400',
      bg: 'bg-red-500/20',
      icon: '🔴'
    }
  };

  const dominantConfig = sentimentConfig[dominantSentiment];

  return (
    <div className={`group relative bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-6 border ${border} shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-opacity-50 overflow-hidden`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(icon, { 
                className: `w-6 h-6 ${icon.props.className || 'text-purple-300'}`
              })}
            </div>
            {/* Active Indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="text-purple-200 text-sm font-medium">
                {articleCount} {articleCount === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </div>

        {/* Dominant Sentiment Badge */}
        <div className={`${dominantConfig.bg} backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5`}>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dominantConfig.color}`}></div>
            <span className={`text-xs font-semibold ${dominantConfig.text} uppercase tracking-wide`}>
              {dominantSentiment}
            </span>
          </div>
        </div>
      </div>

      {/* Sentiment Analytics */}
      <div className="space-y-4 relative z-10">
        {/* Positive Sentiment */}
        <div className="group/item">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-300 text-sm font-semibold">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300 text-sm font-bold">{positive}%</span>
              {positive > 50 && <Sparkles className="w-3 h-3 text-green-400" />}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700 group-hover/item:scale-105 origin-left"
              style={{ width: `${positive}%` }}
            ></div>
          </div>
        </div>

        {/* Neutral Sentiment */}
        <div className="group/item">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-300 text-sm font-semibold">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-300 text-sm font-bold">{neutral}%</span>
              {neutral > 40 && <Activity className="w-3 h-3 text-blue-400" />}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-700 group-hover/item:scale-105 origin-left"
              style={{ width: `${neutral}%` }}
            ></div>
          </div>
        </div>

        {/* Negative Sentiment */}
        <div className="group/item">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-300 text-sm font-semibold">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-300 text-sm font-bold">{negative}%</span>
              {negative > 30 && <Activity className="w-3 h-3 text-red-400" />}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-pink-400 h-2.5 rounded-full transition-all duration-700 group-hover/item:scale-105 origin-left"
              style={{ width: `${negative}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-purple-300 text-xs font-medium">Sentiment Balance</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-300 text-xs">{positive}%</span>
            </div>
            <span className="text-white/40 mx-1">•</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-300 text-xs">{neutral}%</span>
            </div>
            <span className="text-white/40 mx-1">•</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-300 text-xs">{negative}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

export default CategoryCard;