export type ViewState = 'home' | 'hebrew' | 'math' | 'english' | 'spelling';

export interface Question {
  id: string;
  prompt: string;
  speechText?: string; // Text to be read aloud
  visualPrompt?: string; // Secondary visual aid (e.g., fingers for math)
  correctAnswer: string | number;
  options: (string | number)[];
  promptType: 'text' | 'image' | 'number';
  optionType: 'text' | 'image' | 'color';
}

export interface GameState {
  stars: number;
  streak: number;
}