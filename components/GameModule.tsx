import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';
import { FeedbackOverlay } from './FeedbackOverlay';

interface GameModuleProps {
  title: string;
  color: string;
  questions: Question[]; // If static
  questionGenerator?: () => Question; // If dynamic like math
  onBack: () => void;
  onStarEarned: () => void;
}

export const GameModule: React.FC<GameModuleProps> = ({ 
  title, 
  color, 
  questions: initialQuestions, 
  questionGenerator,
  onBack, 
  onStarEarned 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Initialize first question
  useEffect(() => {
    if (questionGenerator) {
      setCurrentQuestion(questionGenerator());
    } else if (initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
    }
  }, [initialQuestions, questionGenerator]);

  // Auto-speak new question
  useEffect(() => {
    if (currentQuestion?.speechText) {
       // Optional: Auto speak when question loads? 
       // Let's keep it manual via button to not annoy, or simple timeout.
    }
  }, [currentQuestion]);

  const handleSpeak = () => {
    if (!currentQuestion) return;
    // English needs English voice, others Hebrew.
    const lang = title === 'אנגלית' ? 'en-US' : 'he-IL';
    audioService.speak(currentQuestion.speechText || currentQuestion.prompt, lang);
  };

  const handleAnswer = (answer: string | number) => {
    if (!currentQuestion || feedback !== null) return;

    if (answer === currentQuestion.correctAnswer) {
      // Correct
      setFeedback('correct');
      audioService.playCorrect();
      onStarEarned();
      createConfetti();
    } else {
      // Incorrect
      setFeedback('incorrect');
      audioService.playIncorrect();
    }
  };

  const handleFeedbackClose = useCallback(() => {
    if (feedback === 'correct') {
      // Next Question
      if (questionGenerator) {
        setCurrentQuestion(questionGenerator());
      } else {
        // Cycle through static questions
        const nextIndex = (currentQuestionIndex + 1) % initialQuestions.length;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(initialQuestions[nextIndex]);
      }
    }
    setFeedback(null);
  }, [feedback, questionGenerator, currentQuestionIndex, initialQuestions]);

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

  // Determine specific styles based on title
  const isMath = title === 'חשבון';
  const isEnglish = title === 'אנגלית';

  // Dynamic text size for long prompts
  const isLongText = currentQuestion.prompt.length > 6;

  // Font size calculation: Math equations can be long, so we reduce size slightly to fit one row
  const fontSizeClass = isMath 
    ? 'text-4xl md:text-5xl' 
    : (isLongText ? 'text-5xl md:text-7xl' : 'text-7xl md:text-8xl');

  return (
    <div className={`min-h-screen flex flex-col ${color} transition-colors duration-500`}>
      <FeedbackOverlay type={feedback} onClose={handleFeedbackClose} />
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <h1 className="text-3xl font-black text-white drop-shadow-md">{title}</h1>
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        
        {/* Question Card */}
        <div className="relative bg-white rounded-3xl shadow-xl p-8 mb-8 w-full flex flex-col items-center justify-center min-h-[200px] animate-bounce-short">
          
          {/* Audio Button */}
          <button 
            onClick={handleSpeak}
            className="absolute top-4 right-4 text-slate-400 hover:text-sky-500 transition-colors p-2 rounded-full hover:bg-slate-100"
            title="השמע"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            
            {/* Visual Prompt (Fingers) */}
            {currentQuestion.visualPrompt && (
              <div className="bg-slate-100 rounded-xl px-6 py-2 mt-2" dir={isMath ? "ltr" : "rtl"}>
                <span className="text-6xl filter drop-shadow-sm select-none">
                  {currentQuestion.visualPrompt}
                </span>
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
                <span className="text-5xl font-bold text-slate-700">{option}</span>
              )}
              {/* For color type, the background is handled in className, content is empty or invisible */}
            </button>
          ))}
        </div>
        
        <p className="mt-8 text-white/80 font-bold text-xl text-center">
          {title === 'אותיות' ? '?מה מתחיל באות זו' : 
           title === 'חשבון' ? '?כמה זה' :
           '?מה זה'}
        </p>

      </div>
    </div>
  );
};
