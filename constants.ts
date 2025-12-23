
import { Question } from './types';

// --- HEBREW DATA (Expanded to >100 items) ---
const HEBREW_VOCAB: Record<string, {word: string, emoji: string}[]> = {
  'א': [{word: 'אַבְטִיחַ', emoji: '🍉'}, {word: 'אַרְיֵה', emoji: '🦁'}, {word: 'אוֹטוֹ', emoji: '🚗'}, {word: 'אֲנָנָס', emoji: '🍍'}, {word: 'אַרְנָב', emoji: '🐰'}, {word: 'אִיגְלוּ', emoji: '🛖'}, {word: 'אֲבָב', emoji: '🥑'}],
  'ב': [{word: 'בַּיִת', emoji: '🏠'}, {word: 'בָּנָנָה', emoji: '🍌'}, {word: 'בָּלוֹן', emoji: '🎈'}, {word: 'בַּרְוָז', emoji: '🦆'}, {word: 'בֻּבָּה', emoji: '🎎'}, {word: 'בֵּיצָה', emoji: '🥚'}, {word: 'בַּרְבּוּר', emoji: '🦢'}],
  'ג': [{word: 'גָּמָל', emoji: '🐫'}, {word: 'גְּלִידָה', emoji: '🍦'}, {word: 'גֶּזֶר', emoji: '🥕'}, {word: 'גִּיטָרָה', emoji: '🎸'}, {word: 'גְּבִינָה', emoji: '🧀'}, {word: 'גִּירָפָה', emoji: '🦒'}, {word: 'גַּלְגַּל', emoji: '🛞'}],
  'ד': [{word: 'דֶּלֶת', emoji: '🚪'}, {word: 'דָּג', emoji: '🐟'}, {word: 'דֻּבִּי', emoji: '🧸'}, {word: 'דְּלִי', emoji: '🪣'}, {word: 'דֶּגֶל', emoji: '🇮🇱'}, {word: 'דּוֹלְפִין', emoji: '🐬'}, {word: 'דְּבוֹרָה', emoji: '🐝'}],
  'ה': [{word: 'הַר', emoji: '⛰️'}, {word: 'הִיפּוֹפּוֹטָם', emoji: '🦛'}, {word: 'הֶלִיקוֹפְּטֶר', emoji: '🚁'}, {word: 'הַמְבּוּרְגֶּר', emoji: '🍔'}, {word: 'הַר גַּעַשׁ', emoji: '🌋'}],
  'ו': [{word: 'וֶרֶד', emoji: '🌹'}, {word: 'וִילּוֹן', emoji: '🪟'}, {word: 'וֵסְט', emoji: '🦺'}, {word: 'וָפֶל', emoji: '🧇'}, {word: 'וִירוּס', emoji: '🦠'}],
  'ז': [{word: 'זַיִת', emoji: '🫒'}, {word: 'זֶבְּרָה', emoji: '🦓'}, {word: 'זְבוּב', emoji: '🪰'}, {word: 'זָהָב', emoji: '🥇'}, {word: 'זַחַל', emoji: '🐛'}, {word: 'זֵר', emoji: '💐'}],
  'ח': [{word: 'חָתוּל', emoji: '🐈'}, {word: 'חֲמוֹר', emoji: '🫏'}, {word: 'חָלָב', emoji: '🥛'}, {word: 'חַלּוֹן', emoji: '🪟'}, {word: 'חֲזִיר', emoji: '🐖'}, {word: 'חֻלְצָה', emoji: '👕'}, {word: 'חַיְזָר', emoji: '👽'}],
  'ט': [{word: 'טֶלֶוִיזְיָה', emoji: '📺'}, {word: 'טֶלֶפוֹן', emoji: '☎️'}, {word: 'טַבַּעַת', emoji: '💍'}, {word: 'טַיָּס', emoji: '🧑‍✈️'}, {word: 'טַוָּס', emoji: '🦚'}, {word: 'טְרַקְטוֹר', emoji: '🚜'}],
  'י': [{word: 'יָרֵחַ', emoji: '🌙'}, {word: 'יֶלֶד', emoji: '👦'}, {word: 'יָד', emoji: '🖐️'}, {word: 'יַנְשׁוּף', emoji: '🦉'}, {word: 'יַהֲלוֹם', emoji: '💎'}, {word: 'יַתּוּשׁ', emoji: '🦟'}],
  'כ': [{word: 'כַּדּוּר', emoji: '⚽'}, {word: 'כֶּלֶב', emoji: '🐕'}, {word: 'כּוֹבַע', emoji: '👒'}, {word: 'כִּסֵּא', emoji: '🪑'}, {word: 'כּוֹכָב', emoji: '⭐'}, {word: 'כֶּתֶר', emoji: '👑'}, {word: 'כְּבִישׁ', emoji: '🛣️'}],
  'ל': [{word: 'לִימוֹן', emoji: '🍋'}, {word: 'לֵב', emoji: '💖'}, {word: 'לֶחֶם', emoji: '🍞'}, {word: 'לִוְיָתָן', emoji: '🐋'}, {word: 'לְטָאָה', emoji: '🦎'}, {word: 'לָמָה', emoji: '🦙'}],
  'מ': [{word: 'מֶלֶךְ', emoji: '👑'}, {word: 'מַתָּנָה', emoji: '🎁'}, {word: 'מְעִיל', emoji: '🧥'}, {word: 'מַסְרֵק', emoji: '🪮'}, {word: 'מְכוֹנִית', emoji: '🚗'}, {word: 'מַפְתֵּחַ', emoji: '🔑'}, {word: 'מִטָּה', emoji: '🛏️'}, {word: 'מַנְגוֹ', emoji: '🥭'}],
  'נ': [{word: 'נֵר', emoji: '🕯️'}, {word: 'נַעַל', emoji: '👞'}, {word: 'נָחָשׁ', emoji: '🐍'}, {word: 'נְמָלָה', emoji: '🐜'}, {word: 'נָמֵר', emoji: '🐆'}, {word: 'נְשִׁיקָה', emoji: '💋'}],
  'ס': [{word: 'סוּס', emoji: '🐴'}, {word: 'סֵפֶר', emoji: '📖'}, {word: 'סִירָה', emoji: '⛵'}, {word: 'סֻלָּם', emoji: '🪜'}, {word: 'סַבּוֹן', emoji: '🧼'}, {word: 'סֻכָּרִיָּה', emoji: '🍬'}],
  'ע': [{word: 'עַיִן', emoji: '👁️'}, {word: 'עֵץ', emoji: '🌳'}, {word: 'עוּגָה', emoji: '🎂'}, {word: 'עִפָּרוֹן', emoji: '✏️'}, {word: 'עַכְבָּר', emoji: '🐭'}, {word: 'עֲגָבְנִיָּה', emoji: '🍅'}, {word: 'עַקְרָב', emoji: '🦂'}],
  'פ': [{word: 'פָּרָה', emoji: '🐄'}, {word: 'פֶּרַח', emoji: '🌸'}, {word: 'פִּיל', emoji: '🐘'}, {word: 'פַּרְפַּר', emoji: '🦋'}, {word: 'פִּיצָה', emoji: '🍕'}, {word: 'פַּטִּישׁ', emoji: '🔨'}, {word: 'פַּנָּס', emoji: '🔦'}],
  'צ': [{word: 'צָב', emoji: '🐢'}, {word: 'צִפּוֹר', emoji: '🐦'}, {word: 'צְפַרְדֵּעַ', emoji: '🐸'}, {word: 'צַלַּחַת', emoji: '🍽️'}, {word: 'צֶבַע', emoji: '🎨'}, {word: 'צִיּוּר', emoji: '🖼️'}],
  'ק': [{word: 'קוֹף', emoji: '🐒'}, {word: 'קֻבִּיָּה', emoji: '🎲'}, {word: 'קַקְטוּס', emoji: '🌵'}, {word: 'קִפּוֹד', emoji: '🦔'}, {word: 'קִיוִוי', emoji: '🥝'}, {word: 'קַסְדָּה', emoji: '⛑️'}],
  'ר': [{word: 'רֹאשׁ', emoji: '🗣️'}, {word: 'רַכֶּבֶת', emoji: '🚆'}, {word: 'רִימּוֹן', emoji: '🍎'}, {word: 'רַמְזוֹר', emoji: '🚦'}, {word: 'רוֹבּוֹט', emoji: '🤖'}, {word: 'רֶגֶל', emoji: '🦶'}],
  'ש': [{word: 'שֶׁמֶשׁ', emoji: '☀️'}, {word: 'שָׁעוֹן', emoji: '⌚'}, {word: 'שֻׁלְחָן', emoji: '🛋️'}, {word: 'שַׁבְּלוּל', emoji: '🐌'}, {word: 'שׁוֹקוֹלָד', emoji: '🍫'}, {word: 'שִׁנַּיִם', emoji: '🦷'}, {word: 'שׁוּעָל', emoji: '🦊'}],
  'ת': [{word: 'תַּפּוּז', emoji: '🍊'}, {word: 'תּוּת', emoji: '🍓'}, {word: 'תִּינוֹק', emoji: '👶'}, {word: 'תַּרְנְגוֹל', emoji: '🐓'}, {word: 'תַּפּוּחַ', emoji: '🍎'}, {word: 'תִּיק', emoji: '🎒'}]
};

export const generateHebrewQuestion = (): Question => {
  const letters = Object.keys(HEBREW_VOCAB);
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const correctItems = HEBREW_VOCAB[letter];
  const correctItem = correctItems[Math.floor(Math.random() * correctItems.length)];
  
  // Distractors
  const distractors: string[] = [];
  while (distractors.length < 2) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    if (randomLetter === letter) continue;
    const items = HEBREW_VOCAB[randomLetter];
    const item = items[Math.floor(Math.random() * items.length)];
    if (!distractors.includes(item.emoji) && item.emoji !== correctItem.emoji) {
      distractors.push(item.emoji);
    }
  }
  
  const options = [correctItem.emoji, ...distractors].sort(() => Math.random() - 0.5);

  return {
    id: `h-${Date.now()}`,
    prompt: letter,
    speechText: `הָאוֹת ${letter}`,
    correctAnswer: correctItem.emoji,
    options: options,
    promptType: 'text',
    optionType: 'image'
  };
};

// --- SPELLING GENERATOR ---
export interface SpellingLevel {
  id: string;
  word: string;
  wordClean: string; // without nikud
  emoji: string;
  scrambledLetters: { id: string, char: string, charWithNikud: string }[];
}

export const generateSpellingLevel = (): SpellingLevel => {
  // Flatten vocab
  const allWords = Object.values(HEBREW_VOCAB).flat();
  // Filter for words between 3 and 6 letters to fit screen
  const suitableWords = allWords.filter(w => {
    // Basic heuristic to strip nikud for length check
    const clean = w.word.replace(/[\u0591-\u05C7]/g, '');
    return clean.length >= 3 && clean.length <= 6;
  });

  const selected = suitableWords[Math.floor(Math.random() * suitableWords.length)];
  
  // Create letter objects
  // Regex to match a letter optionally followed by nikud marks
  const lettersRegex = /[\u0590-\u05FF][\u0591-\u05C7]*/g;
  const lettersWithNikud = selected.word.match(lettersRegex) || [];
  
  // Create scrambled array
  const scrambledLetters = lettersWithNikud.map((char, index) => ({
    id: `l-${index}-${Math.random()}`,
    char: char.replace(/[\u0591-\u05C7]/g, ''), 
    charWithNikud: char
  })).sort(() => Math.random() - 0.5);

  return {
    id: `spell-${Date.now()}`,
    word: selected.word,
    wordClean: selected.word.replace(/[\u0591-\u05C7]/g, ''),
    emoji: selected.emoji,
    scrambledLetters
  };
};

// --- ENGLISH DATA ---
const ENG_COLORS = [
  {name: 'RED', class: 'bg-red-500', isColor: true},
  {name: 'BLUE', class: 'bg-blue-500', isColor: true},
  {name: 'GREEN', class: 'bg-green-500', isColor: true},
  {name: 'YELLOW', class: 'bg-yellow-400', isColor: true},
  {name: 'PINK', class: 'bg-pink-400', isColor: true},
  {name: 'ORANGE', class: 'bg-orange-500', isColor: true},
  {name: 'PURPLE', class: 'bg-purple-600', isColor: true},
  {name: 'BLACK', class: 'bg-black', isColor: true},
  {name: 'WHITE', class: 'bg-white border-2 border-gray-200', isColor: true},
];

const ENG_VOCAB = [
  // Animals
  {name: 'CAT', emoji: '🐱'}, {name: 'DOG', emoji: '🐶'}, {name: 'FISH', emoji: '🐟'},
  {name: 'BIRD', emoji: '🐦'}, {name: 'LION', emoji: '🦁'}, {name: 'TIGER', emoji: '🐯'},
  {name: 'MONKEY', emoji: '🐒'}, {name: 'MOUSE', emoji: '🐭'}, {name: 'ZEBRA', emoji: '🦓'},
  {name: 'COW', emoji: '🐄'}, {name: 'PIG', emoji: '🐖'}, {name: 'RABBIT', emoji: '🐰'},
  {name: 'BEAR', emoji: '🐻'}, {name: 'ELEPHANT', emoji: '🐘'}, {name: 'GIRAFFE', emoji: '🦒'},
  {name: 'HORSE', emoji: '🐎'}, {name: 'SHEEP', emoji: '🐑'}, {name: 'CHICKEN', emoji: '🐔'},
  {name: 'FROG', emoji: '🐸'}, {name: 'TURTLE', emoji: '🐢'}, {name: 'DUCK', emoji: '🦆'},
  {name: 'BUTTERFLY', emoji: '🦋'}, {name: 'BEE', emoji: '🐝'},
  // Food
  {name: 'APPLE', emoji: '🍎'}, {name: 'BANANA', emoji: '🍌'}, {name: 'ORANGE', emoji: '🍊'},
  {name: 'GRAPES', emoji: '🍇'}, {name: 'WATERMELON', emoji: '🍉'}, {name: 'STRAWBERRY', emoji: '🍓'},
  {name: 'PIZZA', emoji: '🍕'}, {name: 'BURGER', emoji: '🍔'}, {name: 'FRIES', emoji: '🍟'},
  {name: 'HOTDOG', emoji: '🌭'}, {name: 'EGG', emoji: '🥚'}, {name: 'BREAD', emoji: '🍞'},
  {name: 'CAKE', emoji: '🎂'}, {name: 'ICE CREAM', emoji: '🍦'}, {name: 'COOKIE', emoji: '🍪'},
  {name: 'CHOCOLATE', emoji: '🍫'}, {name: 'CANDY', emoji: '🍬'}, {name: 'MILK', emoji: '🥛'},
  // Nature
  {name: 'SUN', emoji: '☀️'}, {name: 'MOON', emoji: '🌙'}, {name: 'STAR', emoji: '⭐'},
  {name: 'FLOWER', emoji: '🌸'}, {name: 'TREE', emoji: '🌳'}, {name: 'CACTUS', emoji: '🌵'},
  {name: 'RAINBOW', emoji: '🌈'}, {name: 'FIRE', emoji: '🔥'}, {name: 'WATER', emoji: '💧'},
  // Objects
  {name: 'BALL', emoji: '⚽'}, {name: 'BOOK', emoji: '📖'}, {name: 'PENCIL', emoji: '✏️'},
  {name: 'CRAYON', emoji: '🖍️'}, {name: 'SCISSORS', emoji: '✂️'}, {name: 'BALLOON', emoji: '🎈'},
  {name: 'GIFT', emoji: '🎁'}, {name: 'CAR', emoji: '🚗'}, {name: 'BUS', emoji: '🚌'},
  {name: 'TRAIN', emoji: '🚆'}, {name: 'PLANE', emoji: '✈️'}, {name: 'BOAT', emoji: '⛵'},
  {name: 'BIKE', emoji: '🚲'}, {name: 'DOOR', emoji: '🚪'}, {name: 'BED', emoji: '🛏️'},
  {name: 'CHAIR', emoji: '🪑'}, {name: 'TABLE', emoji: '🛋️'}, {name: 'TV', emoji: '📺'},
  {name: 'PHONE', emoji: '📱'}, {name: 'WATCH', emoji: '⌚'}, {name: 'KEY', emoji: '🔑'},
  // Clothes
  {name: 'HAT', emoji: '👒'}, {name: 'SHOE', emoji: '👞'}, {name: 'SHIRT', emoji: '👕'},
  {name: 'PANTS', emoji: '👖'}, {name: 'DRESS', emoji: '👗'}, {name: 'SOCKS', emoji: '🧦'},
  {name: 'GLASSES', emoji: '👓'}, {name: 'CROWN', emoji: '👑'}
];

// --- ENGLISH GENERATOR ---
// Fix: Add missing generateEnglishQuestion function used in App.tsx
export const generateEnglishQuestion = (): Question => {
  const selected = ENG_VOCAB[Math.floor(Math.random() * ENG_VOCAB.length)];
  
  // Distractors
  const distractors: string[] = [];
  while (distractors.length < 2) {
    const randomItem = ENG_VOCAB[Math.floor(Math.random() * ENG_VOCAB.length)];
    if (randomItem.name !== selected.name && !distractors.includes(randomItem.emoji)) {
      distractors.push(randomItem.emoji);
    }
  }
  
  const options = [selected.emoji, ...distractors].sort(() => Math.random() - 0.5);

  return {
    id: `e-${Date.now()}`,
    prompt: selected.name,
    speechText: selected.name,
    correctAnswer: selected.emoji,
    options: options,
    promptType: 'text',
    optionType: 'image'
  };
};

const MATH_OBJECTS = ['🧊', '🍎', '🍌', '🚗', '🤖', '🎈', '🦆', '⚽', '🍬', '🍦', '🦴', '🐈', '🐶', '🍕', '🚀'];

// Helper to generate Math questions dynamically (Addition and Subtraction)
export const generateMathQuestion = (level: number = 1): Question => {
  const isAddition = Math.random() > 0.5;
  let num1, num2, result, operator;

  const maxVal = level === 1 ? 10 : 20;

  if (isAddition) {
    num1 = Math.floor(Math.random() * (maxVal / 2 + 1)); 
    num2 = Math.floor(Math.random() * (maxVal - num1 + 1)); 
    result = num1 + num2;
    operator = '+';
  } else {
    num1 = Math.floor(Math.random() * maxVal) + 1; 
    num2 = Math.floor(Math.random() * (num1 + 1)); 
    result = num1 - num2;
    operator = '-';
  }

  // Generate Distractors
  const distractors = new Set<number>();
  while (distractors.size < 2) {
    let d = result + Math.floor(Math.random() * 7) - 3; 
    if (d < 0) d = 0;
    if (d > maxVal) d = maxVal;
    if (d !== result) distractors.add(d);
  }
  
  const options = [result, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  const hebrewOp = isAddition ? 'ועוד' : 'פחות';
  const speechText = `${num1} ${hebrewOp} ${num2}`;
  const emoji = MATH_OBJECTS[Math.floor(Math.random() * MATH_OBJECTS.length)];

  return {
    id: `m-${Date.now()}`,
    prompt: `${num1} ${operator} ${num2} = ?`,
    speechText: speechText,
    // Specialized format: MATH:num1|operator|num2|emoji
    visualPrompt: `MATH:${num1}|${operator}|${num2}|${emoji}`,
    correctAnswer: result,
    options: options,
    promptType: 'text', 
    optionType: 'text'
  };
};
