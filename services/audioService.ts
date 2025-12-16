class AudioService {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Load voices
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      // Initial load attempt
      loadVoices();
    }
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public speak(text: string, lang: 'he-IL' | 'en-US' = 'he-IL', interrupt: boolean = true) {
    if (!window.speechSynthesis) return;
    
    // Mobile Browser Fix:
    // Some mobile browsers (Chrome Android, iOS Safari) populate voices lazily or asynchronously.
    // If we have no voices yet, try to get them again right before speaking.
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // Cancel any current speech only if interrupt is requested
    if (interrupt) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness

    // Robust Voice Selection Logic
    // 1. Exact match (e.g. 'he-IL' or 'en-US')
    let voice = this.voices.find(v => v.lang === lang || v.lang.replace('_', '-') === lang);

    // 2. Language match (e.g. 'he' matches 'he-IL')
    if (!voice) {
      const shortLang = lang.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(shortLang));
    }

    // 3. Android legacy Hebrew fallback ('iw' code)
    if (!voice && lang.startsWith('he')) {
      voice = this.voices.find(v => v.lang.startsWith('iw'));
    }

    if (voice) {
      utterance.voice = voice;
    }

    // Explicitly set lang again to ensure fallback works if voice object fails
    utterance.lang = voice ? voice.lang : lang;

    window.speechSynthesis.speak(utterance);
  }

  public playCorrect() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Softer, bell-like tone
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      
      // Soft attack and slow decay
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  public playIncorrect() {
    try {
      const ctx = this.getContext();
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
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }
}

export const audioService = new AudioService();