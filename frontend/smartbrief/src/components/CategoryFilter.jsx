import React from 'react';
import { twMerge } from 'tailwind-merge';

const CATEGORIES = [
  'general',
  'technology',
  'politics',
  'sports',
  'business',
  'health',
  'science',
  'entertainment',
];

// Capitalize first letter
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={twMerge(
              'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors duration-200',
              selected === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-light-border hover:bg-gray-100'
            )}
          >
            {capitalize(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

