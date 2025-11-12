import React from 'react';

const StatCard = ({ icon, title, value, subtitle, trend, gradient }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-white bg-opacity-10`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-gray-300 text-sm mb-2">{title}</h3>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-400 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
