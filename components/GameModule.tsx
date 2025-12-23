import React, { useState, useEffect, useCallback } from 'react';
import { Question, MathLevel } from '../types';
import { audioService } from '../services/audioService';
import { FeedbackOverlay } from './FeedbackOverlay';

interface GameModuleProps {
  title: string;
  color: string;
  questions: Question[]; 
  questionGenerator?: (level?: any) => Question; 
  onBack: () => void;
  onStarEarned: () => void;
  mathLevel?: MathLevel;
  onMathLevelChange?: (lvl: MathLevel) => void;
}

const MathObject: React.FC<{ emoji: string; isSubtracted?: boolean; isPaused?: boolean }> = ({ emoji, isSubtracted, isPaused }) => {
  const animationStyle = { animationPlayState: isPaused ? 'paused' : 'running' };

  return (
    <div 
      className={`
        relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center transition-all
        ${isSubtracted ? 'animate-cube-carried filter grayscale-[0.5]' : 'hover:scale-110 active:scale-95'}
      `}
      style={isSubtracted ? animationStyle : {}}
    >
      {/* Visual Background Blob */}
      <div className={`absolute inset-0 rounded-full opacity-10 ${isSubtracted ? 'bg-red-500' : 'bg-slate-900'}`}></div>
      
      <span className="text-3xl md:text-5xl select-none z-10">
        {emoji}
      </span>
      
      {/* Subtraction X Mark */}
      {isSubtracted && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-4xl animate-x-pulse z-20"
          style={animationStyle}
        >
          ✕
        </div>
      )}
    </div>
  );
};

const MathVisual: React.FC<{ visualPrompt: string }> = ({ visualPrompt }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Format: MATH:num1|operator|num2|emoji
  const parts = visualPrompt.replace('MATH:', '').split('|');
  const num1 = parseInt(parts[0], 10);
  const op = parts[1];
  const num2 = parseInt(parts[2], 10);
  const emoji = parts[3] || '🧊';

  const isAddition = op === '+';

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <div className="flex flex-col items-center gap-4 w-full py-4" dir="ltr">
      {isAddition ? (
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex flex-wrap gap-2 justify-center max-w-[220px]">
            {Array.from({ length: num1 }).map((_, i) => (
              <MathObject key={`a1-${i}`} emoji={emoji} />
            ))}
            {num1 === 0 && <span className="text-2xl font-black text-slate-300">0</span>}
          </div>
          
          <span className="text-4xl font-black text-slate-400 select-none">+</span>
          
          <div className="flex flex-wrap gap-2 justify-center max-w-[220px]">
            {Array.from({ length: num2 }).map((_, i) => (
              <MathObject key={`a2-${i}`} emoji={emoji} />
            ))}
            {num2 === 0 && <span className="text-2xl font-black text-slate-300">0</span>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative flex flex-wrap gap-2 justify-center max-w-[400px] min-h-[50px] md:min-h-[70px]">
            {/* The Remaining Items */}
            {Array.from({ length: num1 - num2 }).map((_, i) => (
              <MathObject key={`s-stay-${i}`} emoji={emoji} />
            ))}
            
            {/* The Taken Items */}
            <div className="relative flex flex-wrap gap-2">
              {Array.from({ length: num2 }).map((_, i) => (
                <MathObject key={`s-take-${i}`} emoji={emoji} isSubtracted isPaused={isPaused} />
              ))}
              
              <div 
                className="absolute -top-4 -right-4 text-7xl pointer-events-none z-20 animate-hand"
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
              >
                🫳
              </div>
            </div>

            {num1 === 0 && <span className="text-2xl font-black text-slate-300">0</span>}
          </div>
          
          <button 
            onClick={togglePause}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md
              ${isPaused ? 'bg-sky-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}
            `}
            dir="rtl"
          >
            {isPaused ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <span>המשך</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                <span>עצור</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200 shadow-sm" dir="rtl">
        <span className="text-slate-700 font-black text-lg">
          {num1} {isAddition ? 'ועוד' : 'פחות'} {num2}
        </span>
      </div>
    </div>
  );
};

export const GameModule: React.FC<GameModuleProps> = ({ 
  title, 
  color, 
  questions: initialQuestions, 
  questionGenerator,
  onBack, 
  onStarEarned,
  mathLevel,
  onMathLevelChange
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Initialize first question
  useEffect(() => {
    if (questionGenerator) {
      setCurrentQuestion(questionGenerator(mathLevel));
    } else if (initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
    }
  }, [initialQuestions, questionGenerator, mathLevel]);

  const handleSpeak = (e: React.MouseEvent) => {
    if (!currentQuestion) return;
    e.stopPropagation();
    const lang = title === 'אנגלית' ? 'en-US' : 'he-IL';
    audioService.speak(currentQuestion.speechText || currentQuestion.prompt, lang);
  };

  const handleAnswer = (answer: string | number) => {
    if (!currentQuestion || feedback !== null) return;

    if (answer === currentQuestion.correctAnswer) {
      setFeedback('correct');
      audioService.playCorrect();
      onStarEarned();
      createConfetti();
    } else {
      setFeedback('incorrect');
      audioService.playIncorrect();
    }
  };

  const handleFeedbackClose = useCallback(() => {
    if (feedback === 'correct') {
      if (questionGenerator) {
        setCurrentQuestion(questionGenerator(mathLevel));
      } else {
        const nextIndex = (currentQuestionIndex + 1) % initialQuestions.length;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(initialQuestions[nextIndex]);
      }
    }
    setFeedback(null);
  }, [feedback, questionGenerator, currentQuestionIndex, initialQuestions, mathLevel]);

  const createConfetti = () => {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.classList.add('confetti');
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (Math.random() * 2 + 1) + 's';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  const isMath = title === 'חשבון';
  const isEnglish = title === 'אנגלית';
  const isLongText = currentQuestion.prompt.length > 6;
  const fontSizeClass = isMath 
    ? 'text-4xl md:text-5xl' 
    : (isLongText ? 'text-5xl md:text-7xl' : 'text-7xl md:text-8xl');

  return (
    <div className={`min-h-screen flex flex-col ${color} transition-colors duration-500 overflow-x-hidden`}>
      <FeedbackOverlay type={feedback} onClose={handleFeedbackClose} />
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-black text-white drop-shadow-md">{title}</h1>
            {isMath && (
              <div className="flex gap-2 mt-2 bg-black/10 p-1 rounded-full">
                <button 
                  onClick={() => onMathLevelChange?.(1)}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mathLevel === 1 ? 'bg-white text-orange-500 shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  עד 10
                </button>
                <button 
                  onClick={() => onMathLevelChange?.(2)}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mathLevel === 2 ? 'bg-white text-orange-500 shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  עד 20
                </button>
              </div>
            )}
        </div>
        <div className="w-12"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        
        {/* Question Card */}
        <div className="relative bg-white rounded-3xl shadow-xl p-4 md:p-8 mb-6 w-full flex flex-col items-center justify-center min-h-[220px]">
          
          <button 
            onClick={handleSpeak}
            className="absolute top-4 right-4 text-slate-300 hover:text-sky-500 transition-colors p-2 rounded-full hover:bg-slate-50"
            title="השמע"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>

          <div className="flex flex-col items-center gap-4 w-full">
            {currentQuestion.promptType === 'text' && (
              <span 
                className={`
                  font-black text-slate-800 text-center leading-tight tracking-wide
                  ${fontSizeClass}
                  ${isEnglish || isMath ? 'whitespace-nowrap' : 'break-all'} 
                `}
                dir={isMath || isEnglish ? "ltr" : "rtl"}
              >
                {currentQuestion.prompt}
              </span>
            )}
            
            {/* Visual Prompt (Animated Objects + Hand) */}
            {currentQuestion.visualPrompt && (
              <div className="w-full bg-slate-50/80 rounded-2xl p-4 border border-slate-100 overflow-hidden">
                {currentQuestion.visualPrompt.startsWith('MATH:') ? (
                  <MathVisual key={currentQuestion.id} visualPrompt={currentQuestion.visualPrompt} />
                ) : (
                  <span className="text-6xl filter drop-shadow-sm select-none">
                    {currentQuestion.visualPrompt}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={`
                aspect-square rounded-2xl shadow-lg transform transition-all active:scale-95 hover:scale-105 flex items-center justify-center
                ${currentQuestion.optionType === 'color' && typeof option === 'string' ? option : 'bg-white hover:bg-gray-50'}
                border-b-8 border-black/10
              `}
            >
              {currentQuestion.optionType === 'image' && (
                <span className="text-6xl filter drop-shadow-sm">{option}</span>
              )}
              {currentQuestion.optionType === 'text' && (
                <span className="text-5xl font-black text-slate-700">{option}</span>
              )}
            </button>
          ))}
        </div>
        
        <p className="mt-8 text-white/90 font-black text-xl text-center drop-shadow-sm">
          {title === 'אותיות' ? '?מה מתחיל באות זו' : 
           title === 'חשבון' ? '?כמה זה' :
           '?מה זה'}
        </p>

      </div>
    </div>
  );
};