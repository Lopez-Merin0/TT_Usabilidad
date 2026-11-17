import { useCallback, useEffect, useState } from 'react';
import { getVoiceVolume, notifyVoicePlaying, setVoiceVolume, VOICE_VOLUME_EVENT } from '../ui/audioSettings';

// Reproducción de los audios del minijuego 3 (hallazgo #03: volumen bajo y poca claridad).
// - Refuerzo de volumen con Web Audio (ganancia + compresor para que no sature)
// - Volumen de voz regulable, compartido con el panel de Sound
// - Opción de escuchar más lento
// - Mientras suena la voz, la música de fondo baja (GameAudio escucha el aviso)

// Ganancia máxima sobre el volumen original del archivo (100% del control = 2.2x)
const VOICE_BOOST = 2.2;

interface VoiceChain {
    gain: GainNode;
}

let audioContext: AudioContext | null = null;
const chains = new WeakMap<HTMLAudioElement, VoiceChain>();

const getChain = (audio: HTMLAudioElement): VoiceChain | null => {
    const existing = chains.get(audio);
    if (existing) return existing;
    try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return null;
        audioContext = audioContext ?? new Ctx();

        const source = audioContext.createMediaElementSource(audio);
        const gain = audioContext.createGain();
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 12;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        source.connect(gain);
        gain.connect(compressor);
        compressor.connect(audioContext.destination);

        const chain = { gain };
        chains.set(audio, chain);
        return chain;
    } catch (error) {
        console.warn('No se pudo reforzar el audio, se usa el volumen normal.', error);
        return null;
    }
};

export const useVoiceAudio = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [voiceVolume, setVoiceVolumeState] = useState(getVoiceVolume);

    useEffect(() => {
        const onChange = (event: Event) => setVoiceVolumeState((event as CustomEvent).detail);
        window.addEventListener(VOICE_VOLUME_EVENT, onChange);
        return () => window.removeEventListener(VOICE_VOLUME_EVENT, onChange);
    }, []);

    // Aplica el volumen elegido al audio (con refuerzo si Web Audio está disponible)
    const applyVolume = useCallback((audio: HTMLAudioElement, volume: number) => {
        const chain = chains.get(audio);
        if (chain) {
            audio.volume = 1;
            chain.gain.gain.value = volume * VOICE_BOOST;
        } else {
            audio.volume = volume;
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) applyVolume(audioRef.current, voiceVolume);
    }, [voiceVolume, applyVolume, audioRef]);

    // Si se sale del minijuego con el audio sonando, la música regresa a su volumen
    useEffect(() => () => notifyVoicePlaying(false), []);

    const play = useCallback(async (rate: number = 1) => {
        const audio = audioRef.current;
        if (!audio) return;
        getChain(audio);
        if (audioContext?.state === 'suspended') {
            await audioContext.resume().catch(() => undefined);
        }
        applyVolume(audio, getVoiceVolume());
        audio.playbackRate = rate;
        audio.currentTime = 0;
        try {
            await audio.play();
            setIsPlaying(true);
            notifyVoicePlaying(true);
        } catch (error) {
            console.warn('No se pudo reproducir el audio.', error);
        }
    }, [audioRef, applyVolume]);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        notifyVoicePlaying(false);
    }, []);

    return {
        isPlaying,
        voiceVolume,
        setVoiceVolume,
        play,
        handleEnded,
    };
};
