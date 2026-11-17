import type { QuestionSupport } from '../components/minigame/supportTypes';
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
    sentence: string;
    options: Option[];
    rules: string;
    dialogue: MinigameDialogue;
}

export const MINIGAME_2_QUESTIONS: MinigameQuestion[] = [
    {
        id: 1,
        sentence: 'She {gap} playing soccer.',
        rules: 'Complete the sentence by selecting the correct form of the verb "to be".',

        options: [
            {
                id: 2,
                text: 'are',
                isCorrect: false,
            },
            {
                id: 3,
                text: 'am',
                isCorrect: false,
            },
            {
                id: 4,
                text: 'be',
                isCorrect: false,
            },
            {
                id: 1,
                text: 'is',
                isCorrect: true,
            },
        ],

        dialogue: {
            introTitle: '🎁 Welcome to Verb Workshop!',

            introGreeting: [
                'Hello! It is great to see you here.',
                'I am Cristi. A customer left a note with a small mission:',
                'They want to see if we know the forms of the verb "to be". Do you accept the challenge?',
                'Your mission: complete the sentence by selecting the correct form of "to be". Let us do this!',
            ],

            correctFeedback: 'Perfect! The correct form is "{text}". "She is playing soccer" sounds excellent. Great job!',
            wrongAttempt1: 'Almost. Remember that "she" is singular. Which form of "to be" belongs here? You have one attempt left.',
            wrongAttempt2: 'That is okay. Keep gaining experience!',

            instruction: 'Select the correct form of the verb "to be" to complete the sentence.',
            questionHeader: 'The challenge is: ',
        }
    },
    {
        id: 2,
        sentence: 'We {gap} ready to start.',
        rules: 'Complete the sentence by selecting the correct plural form of the verb "to be".',

        options: [
            {
                id: 2,
                text: 'is',
                isCorrect: false,
            },
            {
                id: 3,
                text: 'am',
                isCorrect: false,
            },
            {
                id: 4,
                text: 'be',
                isCorrect: false,
            },
            {
                id: 1,
                text: 'are',
                isCorrect: true,
            },
        ],

        dialogue: {
            introTitle: '🚀 Time for Level 2!',
            introGreeting: [
                'Hey! I see you came back with great energy.',
                'Cristi found another mysterious note. It seems someone wants to challenge us again.',
                'This time, use the correct plural form of the verb "to be". Easy, right?',
                'Show your language skills.',
            ],

            correctFeedback:
                'That is it! "{text}" is the correct form. "We are ready" sounds perfect. You are flying!',
            wrongAttempt1:
                'So close, but not quite. Remember that "we" is first-person plural. You have one attempt left. You can do it!',
            wrongAttempt2:
                'That is okay. Keep going!',

            instruction: 'Select the correct form of the verb "to be".',
            questionHeader: 'Complete the sentence:',
        },
    }
];

// Apoyo en español y pistas progresivas por id de pregunta (hallazgos #07 y #08)
export const MINIGAME_2_SUPPORT: Record<number, QuestionSupport> = {
    1: {
        es: {
            rules: 'Completa la oración eligiendo la forma correcta del verbo "to be" (ser/estar).',
            introTitle: '🎁 ¡Bienvenido/a a Verb Workshop (Taller de verbos)!',
            introGreeting: [
                '¡Hola! Qué gusto verte por aquí.',
                'Soy Cristi. Un cliente dejó una nota con una pequeña misión:',
                'Quiere ver si conocemos las formas del verbo "to be". ¿Aceptas el reto?',
                'Tu misión: completa la oración eligiendo la forma correcta de "to be". ¡Vamos!',
            ],
            correctFeedback: '¡Perfecto! La forma correcta es "{text}". "She is playing soccer" (Ella está jugando futbol) suena excelente. ¡Buen trabajo!',
            wrongAttempt1: 'Casi. Recuerda que "she" (ella) es singular. ¿Qué forma de "to be" va aquí? Te queda un intento.',
            wrongAttempt2: 'Está bien. ¡Sigue ganando experiencia!',
            instruction: 'Elige la forma correcta del verbo "to be" para completar la oración.',
            questionHeader: 'El reto es: ',
        },
        hints: [
            { en: '"She" is only one person, like "he" and "it".', es: '"She" (ella) es una sola persona, como "he" e "it".' },
            { en: 'With he, she and it, the verb "to be" ends in "s".', es: 'Con he, she e it, el verbo "to be" termina en "s".' },
        ],
    },
    2: {
        es: {
            rules: 'Completa la oración eligiendo la forma correcta del verbo "to be" en plural.',
            introTitle: '🚀 ¡Hora del nivel 2!',
            introGreeting: [
                '¡Hola! Veo que regresaste con mucha energía.',
                'Cristi encontró otra nota misteriosa. Parece que alguien quiere retarnos otra vez.',
                'Esta vez usa la forma correcta del verbo "to be" en plural. Fácil, ¿no?',
                'Demuestra tus habilidades con el idioma.',
            ],
            correctFeedback: '¡Eso es! "{text}" es la forma correcta. "We are ready" (Estamos listos) suena perfecto. ¡Vas volando!',
            wrongAttempt1: 'Muy cerca, pero no. Recuerda que "we" (nosotros) es primera persona del plural. Te queda un intento. ¡Tú puedes!',
            wrongAttempt2: 'Está bien. ¡Sigue adelante!',
            instruction: 'Elige la forma correcta del verbo "to be".',
            questionHeader: 'Completa la oración: ',
        },
        hints: [
            { en: '"We" means more than one person.', es: '"We" (nosotros) es más de una persona.' },
            { en: 'Use the same form as in "you ___" and "they ___".', es: 'Usa la misma forma que en "you ___" y "they ___".' },
        ],
    },
};
