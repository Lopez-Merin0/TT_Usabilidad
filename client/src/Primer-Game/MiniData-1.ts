import lapiz from '../assets/Primer-Game/lapiz.png';
import llave from '../assets/Primer-Game/llave.png';
import manzana from '../assets/Primer-Game/manzana.png';
import taza from '../assets/Primer-Game/taza.png';

const LAPIZ = lapiz;
const LLAVE = llave;
const MANZANA = manzana;
const TAZA = taza;

export interface Option {
    id: number;
    imagePath: string;
    isCorrect: boolean;
}

export interface MinigameDialogue {
    introTitle: string;
    introGreeting: string | string[];

    correctFeedback: string;
    wrongAttempt1: string;
    wrongAttempt2: string;

    instruction: string;
    questionHeader: string;
}

export interface MinigameQuestion {
    id: number;
    word: string;
    options: Option[];
    rules: string;
    dialogue: MinigameDialogue;
}

export const MINIGAME_QUESTIONS: MinigameQuestion[] = [
    {
        id: 1,
        word: 'Cup',
        rules: 'You will be given the name of an object. Your mission is to select the image that matches the word.',
        options: [
            {
                id: 1,
                imagePath: MANZANA,
                isCorrect: false,
            },
            {
                id: 2,
                imagePath: TAZA,
                isCorrect: true,
            },
            {
                id: 3,
                imagePath: LAPIZ,
                isCorrect: false,
            },
            {
                id: 4,
                imagePath: LLAVE,
                isCorrect: false,
            },
        ],

        dialogue: {
            introTitle: '☕ Welcome to Word Hunt!',

            introGreeting: [
                'Hello! It is wonderful to see you in Word Hunt!',
                'Did you know this place was once just a small wild coffee bush?',
                'We carefully cultivated it into the story-filled, aromatic refuge it is today.',
                'Before you relax with your drink, I have a fun little challenge for you. Show us that you know our treasures!',
            ],

            correctFeedback: 'Congratulations, that is the attitude of a true explorer! The word "{word}" is yours! Keep enjoying your sweet adventure!',
            wrongAttempt1: 'Oops! That does not seem to be the right image, but do not worry. You have one more chance to find the word "{word}". You can do it!',
            wrongAttempt2: 'Do not give up. Sometimes the aroma distracts us. The real prize is the experience. Close this window and keep enjoying the Corner.',

            instruction: 'Your mission is clear: show us that you can recognize the treasures in our cafe. Select the image that matches the word above.',
            questionHeader: 'Find the treasure: ',
        }
    },
    {
        id: 2,
        word: 'Apple',
        rules: 'You will be given the name of an object. Your mission is to select the image that matches the word.',
        options: [
            {
                id: 1,
                imagePath: TAZA,
                isCorrect: false,
            },
            {
                id: 4,
                imagePath: LLAVE,
                isCorrect: false,
            },
            {
                id: 3,
                imagePath: LAPIZ,
                isCorrect: false,
            },
            {
                id: 2,
                imagePath: MANZANA,
                isCorrect: true,
            },
        ],
        dialogue: {
            introTitle: '☕ Second Challenge!',
            introGreeting: 'Excellent! Now let us find the second treasure. Can you identify the apple?',
            correctFeedback: 'Perfect! You have completed all the challenges. You are a true apple expert!',
            wrongAttempt1: 'Almost! The apple color is unmistakable. You have one more chance to find "{word}".',
            wrongAttempt2: 'That is okay; learning is what matters. Try again!',
            instruction: 'Second challenge: select the image that matches the word above.',
            questionHeader: 'Find the treasure: ',
        }
    }
];