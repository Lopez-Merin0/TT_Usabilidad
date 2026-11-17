// Resumen del avance del jugador: porcentaje general y siguiente destino.
// Lee el mismo localStorage que usan los minijuegos y minigameUtils.
import { MINIGAME_QUESTIONS } from '../Primer-Game/MiniData-1';
import { MINIGAME_2_QUESTIONS } from '../Segundo-Game/MiniData-2';
import { MINIGAME_3_QUESTIONS } from '../Tercer-Game/MiniData-3';

export type MinigameKey = 'FirstMinigame' | 'SecondMinigame' | 'ThirdMinigame';

export interface MinigameInfo {
    key: MinigameKey;
    storageKey: string;
    name: string;
    nameEs: string;
    skill: string;
    skillEs: string;
    houseEs: string;
    houseEn: string;
    total: number;
}

export const MINIGAMES: MinigameInfo[] = [
    {
        key: 'FirstMinigame',
        storageKey: 'minigameProgress',
        name: 'Word Hunt',
        nameEs: 'Cacería de palabras',
        skill: 'Vocabulary',
        skillEs: 'Vocabulario',
        houseEn: 'teal house (west)',
        houseEs: 'casa turquesa (oeste)',
        total: MINIGAME_QUESTIONS.length,
    },
    {
        key: 'SecondMinigame',
        storageKey: 'minigame2Progress',
        name: 'Verb Workshop',
        nameEs: 'Taller de verbos',
        skill: 'Grammar',
        skillEs: 'Gramática',
        houseEn: 'green house (north)',
        houseEs: 'casa verde (norte)',
        total: MINIGAME_2_QUESTIONS.length,
    },
    {
        key: 'ThirdMinigame',
        storageKey: 'minigame3Progress',
        name: 'Sweet Sounds',
        nameEs: 'Dulces sonidos',
        skill: 'Listening',
        skillEs: 'Comprensión auditiva',
        houseEn: 'purple house (east)',
        houseEs: 'casa morada (este)',
        total: MINIGAME_3_QUESTIONS.length,
    },
];

const readCompleted = (storageKey: string): number => {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed?.completedQuestions) ? parsed.completedQuestions.length : 0;
    } catch {
        return 0;
    }
};

export interface MinigameStatus extends MinigameInfo {
    completed: number;
    isCompleted: boolean;
    isUnlocked: boolean;
}

export interface OverallProgress {
    games: MinigameStatus[];
    completedChallenges: number;
    totalChallenges: number;
    percent: number;
    // Siguiente minijuego por hacer, o null si ya se completaron todos
    next: MinigameStatus | null;
}

export const getOverallProgress = (): OverallProgress => {
    const games: MinigameStatus[] = [];
    let previousCompleted = true;

    MINIGAMES.forEach((game) => {
        const completed = Math.min(readCompleted(game.storageKey), game.total);
        const isCompleted = completed >= game.total;
        // Se desbloquean en orden: cada uno requiere terminar el anterior
        const isUnlocked = previousCompleted;
        games.push({ ...game, completed, isCompleted, isUnlocked });
        previousCompleted = previousCompleted && isCompleted;
    });

    const completedChallenges = games.reduce((sum, g) => sum + g.completed, 0);
    const totalChallenges = games.reduce((sum, g) => sum + g.total, 0);
    const percent = totalChallenges === 0 ? 0 : Math.round((completedChallenges / totalChallenges) * 100);
    const next = games.find((g) => g.isUnlocked && !g.isCompleted) ?? null;

    return { games, completedChallenges, totalChallenges, percent, next };
};
