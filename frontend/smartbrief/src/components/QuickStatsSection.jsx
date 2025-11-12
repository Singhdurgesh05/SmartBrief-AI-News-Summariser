import React from 'react';

const QuickStatsSection = ({ stats }) => {
  const { totalArticles, savedItems, sources, keywords } = stats;

  const statItems = [
    { value: totalArticles, label: 'Total Articles', color: 'text-purple-400' },
    { value: savedItems, label: 'Saved Items', color: 'text-cyan-400' },
    { value: sources, label: 'Sources', color: 'text-pink-400' },
    { value: keywords, label: 'Keywords', color: 'text-orange-400' },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-[#2d2550] to-[#1a1635] rounded-2xl p-8 text-center border border-purple-500 border-opacity-20 shadow-lg hover:border-opacity-40 transition-all">
            <p className={`text-5xl font-bold ${item.color} mb-2`}>
              {item.value}
            </p>
            <p className="text-gray-400 text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsSection;
