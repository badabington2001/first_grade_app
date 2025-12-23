import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpellingLevel, SpellingLevel } from '../constants';
import { audioService } from '../services/audioService';
import { FeedbackOverlay } from './FeedbackOverlay';

interface SpellingGameModuleProps {
  onBack: () => void;
  onStarEarned: () => void;
}

interface DragState {
  active: boolean;
  id: string | null;
  char: string | null;
  x: number;
  y: number;
  targetSlot: number | null; // Track which slot is currently hovered
}

export const SpellingGameModule: React.FC<SpellingGameModuleProps> = ({ onBack, onStarEarned }) => {
  const [level, setLevel] = useState<SpellingLevel | null>(null);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [poolLetters, setPoolLetters] = useState<{id: string, char: string, charWithNikud: string, used: boolean}[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Custom Drag State
  const [dragState, setDragState] = useState<DragState>({
    active: false, id: null, char: null, x: 0, y: 0, targetSlot: null
  });

  const initLevel = useCallback(() => {
    const newLevel = generateSpellingLevel();
    setLevel(newLevel);
    setPlacedLetters(new Array(newLevel.scrambledLetters.length).fill(null));
    setPoolLetters(newLevel.scrambledLetters.map(l => ({...l, used: false})));
    setFeedback(null);
  }, []);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // --- Pointer Event Handlers ---

  const handlePointerDown = (e: React.PointerEvent, id: string, char: string) => {
    const target = e.currentTarget as HTMLElement;
    try {
        target.setPointerCapture(e.pointerId);
    } catch (err) {}

    setDragState({
      active: true,
      id,
      char,
      x: e.clientX,
      y: e.clientY,
      targetSlot: null
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (dragState.active) {
        if (e.cancelable) e.preventDefault();
        
        // Hit test for slots
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const slotElement = elements.find(el => el.hasAttribute('data-slot-index'));
        let hoverIdx: number | null = null;
        if (slotElement) {
            const indexStr = slotElement.getAttribute('data-slot-index');
            if (indexStr !== null) hoverIdx = parseInt(indexStr, 10);
        }

        setDragState(prev => ({
          ...prev,
          x: e.clientX,
          y: e.clientY,
          targetSlot: hoverIdx
        }));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (dragState.active) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const slotElement = elements.find(el => el.hasAttribute('data-slot-index'));
        
        if (slotElement) {
          const indexStr = slotElement.getAttribute('data-slot-index');
          if (indexStr !== null) {
            const slotIndex = parseInt(indexStr, 10);
            handleDrop(slotIndex, dragState.id!, dragState.char!);
          }
        }

        setDragState(prev => ({ ...prev, active: false, id: null, char: null, targetSlot: null }));
      }
    };

    if (dragState.active) {
      window.addEventListener('pointermove', handlePointerMove, { passive: false });
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState.active, dragState.id, dragState.char]);
  
  const handleDropRef = useRef<(index: number, id: string, char: string) => void>(() => {});
  
  const performDrop = (slotIndex: number, letterId: string, char: string) => {
    setPlacedLetters(prev => {
        if (prev[slotIndex] !== null) return prev;
        
        setPoolLetters(poolPrev => {
            const item = poolPrev.find(l => l.id === letterId);
            if (!item || item.used) return poolPrev;
            return poolPrev.map(l => l.id === letterId ? { ...l, used: true } : l);
        });

        const newPlaced = [...prev];
        newPlaced[slotIndex] = char;
        return newPlaced;
    });
  };

  useEffect(() => {
    handleDropRef.current = performDrop;
  });

  const handleDrop = (slotIndex: number, letterId: string, char: string) => {
    handleDropRef.current(slotIndex, letterId, char);
  };

  const handlePoolLetterClick = (letterId: string, char: string) => {
    if (feedback || dragState.active) return;
    const emptyIndex = placedLetters.indexOf(null);
    if (emptyIndex === -1) return;
    performDrop(emptyIndex, letterId, char);
  };

  const handleSlotClick = (index: number) => {
    if (feedback) return;
    const char = placedLetters[index];
    if (!char) return;

    setPlacedLetters(prev => {
        const newPlaced = [...prev];
        newPlaced[index] = null;
        return newPlaced;
    });

    setPoolLetters(prev => {
      const newPool = [...prev];
      const foundIndex = newPool.findIndex(l => l.charWithNikud === char && l.used);
      if (foundIndex !== -1) {
        newPool[foundIndex] = { ...newPool[foundIndex], used: false };
      }
      return newPool;
    });
  };

  useEffect(() => {
    if (!level || feedback !== null) return;
    
    const isFull = placedLetters.every(l => l !== null);
    if (isFull) {
        const formedWord = placedLetters.join('');
        if (formedWord === level.word) {
            setFeedback('correct');
            audioService.playCorrect();
            onStarEarned();
            createConfetti();
        } else {
            setFeedback('incorrect');
            audioService.playIncorrect();
        }
    }
  }, [placedLetters, level, onStarEarned, feedback]);

  const handleFeedbackClose = () => {
    if (feedback === 'correct') {
      initLevel();
    } else if (feedback === 'incorrect') {
      setPlacedLetters(new Array(placedLetters.length).fill(null));
      setPoolLetters(prev => prev.map(l => ({ ...l, used: false })));
    }
    setFeedback(null);
  };

  const createConfetti = () => {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.classList.add('confetti');
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (Math.random() * 2 + 1) + 's';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.zIndex = '200';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  };

  if (!level) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-emerald-400 transition-colors duration-500 overflow-hidden select-none touch-none">
       <FeedbackOverlay 
         type={feedback} 
         onClose={handleFeedbackClose} 
         duration={feedback === 'correct' ? 1000 : 1500} 
       />

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
        <h1 className="text-3xl font-black text-white drop-shadow-md">איות</h1>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 max-w-2xl mx-auto w-full gap-4 md:gap-8">
        
        {/* Image Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center z-10">
            <span className="text-8xl md:text-9xl filter drop-shadow-sm">{level.emoji}</span>
        </div>

        {/* Word Area */}
        <div className="flex items-center justify-center gap-4 w-full z-10">
            {/* Empty Slots */}
            <div className="flex flex-row gap-2 md:gap-4 justify-center" dir="rtl">
                {placedLetters.map((char, idx) => (
                    <div
                        key={`slot-${idx}`}
                        data-slot-index={idx}
                        onClick={() => handleSlotClick(idx)}
                        className={`
                            w-14 h-14 md:w-20 md:h-20 rounded-xl border-4 flex items-center justify-center text-4xl font-bold transition-all cursor-pointer z-10
                            ${char 
                              ? 'bg-white border-white text-slate-800 shadow-md' 
                              : (dragState.active && dragState.targetSlot === idx 
                                ? 'bg-white/40 border-white scale-110 animate-pulse' 
                                : 'bg-black/20 border-white/40 border-dashed text-transparent hover:bg-white/10')}
                        `}
                    >
                        {char || '?'}
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-1"></div>

        {/* Scrambled Letters Pool */}
        <div className="w-full bg-white/20 rounded-t-3xl p-6 pb-12 z-10">
            <p className="text-center text-white font-bold text-lg mb-4 opacity-80">
                לחץ או גרור את האותיות
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative" dir="rtl">
                {poolLetters.map((l) => (
                    <div
                        key={l.id}
                        onPointerDown={(e) => !l.used && handlePointerDown(e, l.id, l.charWithNikud)}
                        onClick={() => !l.used && handlePoolLetterClick(l.id, l.charWithNikud)}
                        className={`
                            w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-4xl font-bold transition-all select-none touch-none
                            ${l.used 
                                ? 'bg-white/10 text-transparent scale-90 cursor-default border-none' 
                                : (dragState.active && dragState.id === l.id 
                                    ? 'bg-emerald-300 scale-95 opacity-50' 
                                    : 'bg-white text-emerald-600 cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 border-b-4 border-black/10')}
                        `}
                    >
                        {l.charWithNikud}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Floating Drag Item */}
      {dragState.active && dragState.char && (
        <div 
            className="fixed w-20 h-20 bg-white/95 text-emerald-600 rounded-2xl shadow-2xl flex items-center justify-center text-5xl font-bold z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 border-4 border-emerald-400"
            style={{
                left: dragState.x,
                top: dragState.y,
            }}
        >
            {dragState.char}
        </div>
      )}
    </div>
  );
}