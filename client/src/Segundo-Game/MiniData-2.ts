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
