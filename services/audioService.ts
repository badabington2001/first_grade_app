class AudioService {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private unlock() {
    if (this.isUnlocked || !window.speechSynthesis) return;
    try {
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      this.isUnlocked = true;
    } catch (e) {}
  }

  public speak(text: string, lang: 'he-IL' | 'en-US' = 'he-IL', interrupt: boolean = true, onEnd?: () => void) {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    this.unlock();
    
    // Crucial for Chrome: Thoroughly clear the queue
    if (interrupt) {
      window.speechSynthesis.cancel();
    }
    window.speechSynthesis.resume();

    // Aggressive text cleaning for Hebrew
    const cleanText = text.replace(/[^\u05D0-\u05EA\s]/g, '').trim();
    if (!cleanText && text.length > 0) {
      // If we stripped everything but had text, it might be English or other
      // Fallback to original text if regex was too aggressive
    }

    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = lang;
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // Advanced selection for Chrome Android
    let voice = this.voices.find(v => v.lang === lang || v.lang.replace('_', '-') === lang);
    if (!voice) {
      // Look for Google voices (very common on Chrome)
      voice = this.voices.find(v => (v.name.includes('Google') || v.name.includes('Hebrew') || v.name.includes('עברית')) && 
                                   (v.lang.includes('he') || v.lang.includes('iw')));
      if (!voice) {
          voice = this.voices.find(v => v.lang.includes('he') || v.lang.includes('iw'));
      }
    }
    
    if (voice) {
      utterance.voice = voice;
    }

    let finished = false;
    const handleEnd = () => {
      if (!finished) {
        finished = true;
        onEnd?.();
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = (e) => {
      console.error("Speech Error:", e);
      handleEnd();
    };

    // Failsafe for browsers where onend never fires
    setTimeout(handleEnd, 3000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speak failed:", e);
      handleEnd();
    }
  }

  public playCorrect() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  }

  public playIncorrect() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

export const audioService = new AudioService();