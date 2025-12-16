import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { generateHebrewQuestion, generateEnglishQuestion, generateMathQuestion } from './constants';
import { GameModule } from './components/GameModule';
import { SpellingGameModule } from './components/SpellingGameModule';
import { StarCounter } from './components/StarCounter';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [stars, setStars] = useState(0);

  // Load stars from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rfg_stars');
    if (saved) setStars(parseInt(saved, 10));
  }, []);

  const addStar = () => {
    const newCount = stars + 1;
    setStars(newCount);
    localStorage.setItem('rfg_stars', newCount.toString());
  };

  const renderView = () => {
    switch (view) {
      case 'hebrew':
        return (
          <GameModule
            title="אותיות"
            color="bg-sky-400"
            questionGenerator={generateHebrewQuestion}
            questions={[]}
            onBack={() => setView('home')}
            onStarEarned={addStar}
          />
        );
      case 'math':
        return (
          <GameModule
            title="חשבון"
            color="bg-orange-400"
            questionGenerator={generateMathQuestion}
            questions={[]}
            onBack={() => setView('home')}
            onStarEarned={addStar}
          />
        );
      case 'english':
        return (
          <GameModule
            title="אנגלית"
            color="bg-purple-400"
            questionGenerator={generateEnglishQuestion}
            questions={[]}
            onBack={() => setView('home')}
            onStarEarned={addStar}
          />
        );
      case 'spelling':
        return (
          <SpellingGameModule
            onBack={() => setView('home')}
            onStarEarned={addStar}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 text-center mb-2 mt-8">
              מוכנים לכיתה א׳
            </h1>
            <p className="text-xl text-slate-500 font-medium mb-10 text-center">
              !בואו נשחק ונלמד ביחד
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-2">
              
              <button 
                onClick={() => setView('hebrew')}
                className="group relative h-64 bg-sky-400 rounded-3xl shadow-xl border-b-8 border-sky-600 active:border-b-0 active:translate-y-2 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-8xl mb-4 drop-shadow-md">א</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">אותיות</span>
                </div>
              </button>

              <button 
                onClick={() => setView('math')}
                className="group relative h-64 bg-orange-400 rounded-3xl shadow-xl border-b-8 border-orange-600 active:border-b-0 active:translate-y-2 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-8xl mb-4 drop-shadow-md">123</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">חשבון</span>
                </div>
              </button>

              <button 
                onClick={() => setView('english')}
                className="group relative h-64 bg-purple-400 rounded-3xl shadow-xl border-b-8 border-purple-600 active:border-b-0 active:translate-y-2 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-8xl mb-4 drop-shadow-md">ABC</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">אנגלית</span>
                </div>
              </button>

               <button 
                onClick={() => setView('spelling')}
                className="group relative h-64 bg-emerald-400 rounded-3xl shadow-xl border-b-8 border-emerald-600 active:border-b-0 active:translate-y-2 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-8xl mb-4 drop-shadow-md">✏️</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">איות</span>
                </div>
              </button>

            </div>
            
            <footer className="mt-auto pt-10 text-slate-400 font-medium text-sm">
              בהצלחה לכל הילדים העולים לכיתה א׳
            </footer>
          </div>
        );
    }
  };

  return (
    <>
      <StarCounter count={stars} />
      {renderView()}
    </>
  );
};

export default App;