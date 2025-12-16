import React from 'react';

interface StarCounterProps {
  count: number;
}

export const StarCounter: React.FC<StarCounterProps> = ({ count }) => {
  return (
    <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-yellow-400 flex items-center gap-2 transition-transform hover:scale-105">
      <span className="text-2xl">⭐</span>
      <span className="text-2xl font-black text-yellow-500 tabular-nums">{count}</span>
    </div>
  );
};
