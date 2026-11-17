import type { Bilingual } from './MinigameAssist';

// Apoyo en español y pistas de una pregunta. Las traducciones no revelan la
// respuesta: la palabra/oración a encontrar se deja en inglés.
export interface QuestionSupport {
    es: {
        rules: string;
        introTitle: string;
        introGreeting: string | string[];
        correctFeedback: string;
        wrongAttempt1: string;
        wrongAttempt2: string;
        instruction: string;
        questionHeader: string;
    };
    hints: Bilingual[];
}
