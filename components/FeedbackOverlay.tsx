import React, { useEffect } from 'react';

interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect' | null;
  onClose: () => void;
  duration?: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ type, onClose, duration = 1500 }) => {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(onClose, duration); // Auto close after specified duration
      return () => clearTimeout(timer);
    }
  }, [type, onClose, duration]);

  if (!type) return null;

  const isCorrect = type === 'correct';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div className={`
        transform transition-all duration-300 scale-100
        p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border-4
        ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}
      `}>
        <div className="text-8xl animate-bounce-short">
          {isCorrect ? '🌟' : '🤔'}
        </div>
        <h2 className={`text-4xl font-black ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? '!כל הכבוד' : '!ננסה שוב'}
        </h2>
      </div>
    </div>
  );
};