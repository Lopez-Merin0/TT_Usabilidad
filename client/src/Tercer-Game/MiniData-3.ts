import audio1 from '../assets/Tercer-Game/how-are-you-doing-today.mp3';
import audio2 from '../assets/Tercer-Game/hello-can-i-help-you.mp3';

const AUDIO1 = audio1;
const AUDIO2 = audio2;

export interface Option {
    id: number;
    text: string;
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
    audioUrl: string;
    audioText: string;
    options: Option[];
    rules: string;
    dialogue: MinigameDialogue;
}

export const MINIGAME_3_QUESTIONS: MinigameQuestion[] = [
    {
        id: 1,
        audioUrl: AUDIO1,
        audioText: 'How are you doing today?',
        rules: 'Listen carefully to the audio and select the correct English sentence.',

        options: [
            {
                id: 1,
                text: 'What are you doing today?',
                isCorrect: false,
            },
            {
                id: 2,
                text: 'How are you doing today?',
                isCorrect: true,
            },
            {
                id: 3,
                text: 'How old are you?',
                isCorrect: false,
            },
            {
                id: 4,
                text: 'What is your name?',
                isCorrect: false,
            },
        ],

        dialogue: {
            introTitle: "🍭 The Sweet Listening Challenge at 'Sweet Sounds'",

            introGreeting: [
                "Welcome! We are Carlos and Chuy, the hosts of 'Sweet Sounds'.",
                "We have left you an everyday greeting, but only if you listen carefully.",
                "Listen to the customer's sentence and select exactly what you heard.",
                "Let us see whether your listening is sweeter than our candy!"
            ],

            correctFeedback: "Excellent listening! You earned a well-deserved imaginary candy.",
            wrongAttempt1: "Mmm... almost. Listen carefully again. You have one attempt left.",
            wrongAttempt2: "That is okay. Making mistakes is normal.",

            instruction: "Press the button to play the audio and choose the correct sentence.",
            questionHeader: "What does the customer say?"
        }
    },
    {
        id: 2,
        audioUrl: AUDIO2,
        audioText: 'Hello, can I help you?',
        rules: 'Listen carefully to the customer-service question and select the sentence that matches the audio.',

        options: [
            {
                id: 2,
                text: 'Hello, how are you?',
                isCorrect: false,
            },
            {
                id: 3,
                text: 'What would you like?',
                isCorrect: false,
            },
            {
                id: 4,
                text: 'Can you help me, please?',
                isCorrect: false,
            },
            {
                id: 1,
                text: 'Hello, can I help you?',
                isCorrect: true,
            },
        ],

        dialogue: {
            introTitle: "🎤 Audio Challenge #2 at 'Sweet Sounds'!",
            introGreeting: [
                "We are going strong! Carlos and Chuy left you another freshly recorded audio.",
                "This time it is a friendly offer to help, but nothing here is as easy as it seems.",
                "Pay attention and show off your golden ears.",
                "Ready for another round?"
            ],

            correctFeedback: "That is it! Your listening is as sharp as dental floss.",
            wrongAttempt1: "Mmm... close. Listen again calmly. You still have one attempt.",
            wrongAttempt2: "All good. Come back and try again!",

            instruction: "Press the button to play the audio and choose the correct question.",
            questionHeader: "What did you hear?"
        }
    }
];
