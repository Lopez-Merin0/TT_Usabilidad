// Ajustes de audio compartidos entre la música (GameAudio) y los audios
// educativos (minijuego 3). Se comunican con eventos de window para no
// tener que pasar props por todas las pantallas.

const VOICE_VOLUME_KEY = 'voiceVolume';
export const VOICE_VOLUME_EVENT = 'tt-voice-volume';
export const VOICE_PLAYING_EVENT = 'tt-voice-playing';

export const DEFAULT_VOICE_VOLUME = 1;

export const getVoiceVolume = (): number => {
    try {
        const saved = localStorage.getItem(VOICE_VOLUME_KEY);
        const value = saved !== null ? parseFloat(saved) : DEFAULT_VOICE_VOLUME;
        return Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : DEFAULT_VOICE_VOLUME;
    } catch {
        return DEFAULT_VOICE_VOLUME;
    }
};

export const setVoiceVolume = (value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    try {
        localStorage.setItem(VOICE_VOLUME_KEY, clamped.toString());
    } catch {
        // sin almacenamiento disponible: solo se aplica en esta sesión
    }
    window.dispatchEvent(new CustomEvent(VOICE_VOLUME_EVENT, { detail: clamped }));
};

// Avisa a GameAudio que un audio educativo empezó/terminó, para bajar la música
// mientras suena y que no tape la voz.
export const notifyVoicePlaying = (playing: boolean) => {
    window.dispatchEvent(new CustomEvent(VOICE_PLAYING_EVENT, { detail: playing }));
};
