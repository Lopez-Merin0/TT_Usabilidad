import background from '../assets/Segundo-Game/secondGame.jpg';

export const KAWAI_COLORS = {
    bgLight: '#FBF0DF',
    bgMedium: '#f7e7d4',
    bgDark: '#A58B79',
    panelLight: '#F7F0E6',
    panelBorder: '#8B7360',
    textDark: '#4A3C32',
    textMedium: '#F7F0E6',
    textGreen: '#2E6F40',
    accentGreen: '#B2D8BB',
    accentPink: '#FFC0CB',
    shadowLight: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.3)',
    accentRed: '#FF6347',
    borderRed: '#CC0000',
};

export const KAWAI_FONTS = {
    comfortaa: "'Comfortaa', cursive, Arial, sans-serif",
    mali: "'Mali', cursive, Arial, sans-serif",
};

export const KAWAI_TEXTURES = {
    texturePaper: 'url("https://www.transparenttextures.com/patterns/white-paperboard.png")',
};

export const MINIGAME_BACKGROUND = background;

export const KAWAI_STYLES = {
    header: { fontFamily: KAWAI_FONTS.mali, color: KAWAI_COLORS.textDark, fontSize: '1.4rem', marginBottom: '6px' },
    instruction: { color: KAWAI_COLORS.textDark, fontSize: '1.05rem', marginBottom: '6px' },
    word: { fontSize: '1.4rem', color: KAWAI_COLORS.textGreen },
    feedbackCorrect: { fontWeight: 'bold' as 'bold', color: KAWAI_COLORS.textGreen, marginTop: '10px' },
    feedbackIncorrect: { fontWeight: 'bold' as 'bold', color: KAWAI_COLORS.accentRed, marginTop: '10px' },
};
