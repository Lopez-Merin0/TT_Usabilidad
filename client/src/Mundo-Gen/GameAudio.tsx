import React, { useEffect, useRef, useCallback, useState } from 'react';
import { VOICE_PLAYING_EVENT } from '../ui/audioSettings';
import background from '../assets/mundo/bg.mp3';
import click from '../assets/mundo/click.mp3';

const BG = background;
const CLICK = click;

const AUDIO_PATHS = {
    BGM: BG,
    CLICK_SFX: CLICK,
};

interface GameAudioProps {
    isMusicEnabled: boolean;

    musicVolume?: number;
    sfxVolume?: number;
}


const GameAudio: React.FC<GameAudioProps> = ({
    isMusicEnabled,
    musicVolume = 0.1,
    sfxVolume = 0.7,
}) => {
    const bgmRef = useRef<HTMLAudioElement>(null);
    const sfxRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const bgm = bgmRef.current;
        if (!bgm) return;

        bgm.volume = isMusicEnabled ? musicVolume : 0;
        bgm.loop = true;

        if (isMusicEnabled) {
            bgm.play().catch(error => {
                console.warn("La reproducción automática de BGM fue bloqueada. El usuario debe interactuar primero.", error);
            });
        } else {
            bgm.pause();
        }
    }, [isMusicEnabled, musicVolume]);

    // Los navegadores bloquean el audio hasta que el usuario interactúa con la página.
    // Si el play() inicial fue bloqueado, se reintenta con la primera interacción.
    useEffect(() => {
        if (!isMusicEnabled) return;

        const unlockAudio = () => {
            const bgm = bgmRef.current;
            if (!bgm || !bgm.paused) {
                removeListeners();
                return;
            }
            bgm.play()
                .then(removeListeners)
                .catch(error => {
                    console.warn("No se pudo iniciar la BGM tras la interacción del usuario.", error);
                });
        };

        const events = ['pointerdown', 'keydown', 'touchstart'];
        const removeListeners = () => {
            events.forEach(e => document.removeEventListener(e, unlockAudio));
        };

        events.forEach(e => document.addEventListener(e, unlockAudio));
        return removeListeners;
    }, [isMusicEnabled]);

    // Mientras suena un audio educativo (minijuego 3) la música baja al 15%
    // para que no tape la voz; al terminar regresa a su volumen.
    const [isVoicePlaying, setIsVoicePlaying] = useState(false);

    useEffect(() => {
        const onVoice = (event: Event) => setIsVoicePlaying(Boolean((event as CustomEvent).detail));
        window.addEventListener(VOICE_PLAYING_EVENT, onVoice);
        return () => window.removeEventListener(VOICE_PLAYING_EVENT, onVoice);
    }, []);

    useEffect(() => {
        if (bgmRef.current) {
            const target = isMusicEnabled ? musicVolume : 0;
            bgmRef.current.volume = isVoicePlaying ? target * 0.15 : target;
        }
    }, [musicVolume, isMusicEnabled, isVoicePlaying]);

    const playClickSFX = useCallback(() => {
        const sfx = sfxRef.current;
        if (sfx && isMusicEnabled) {
            sfx.volume = sfxVolume;
            sfx.currentTime = 0;
            sfx.play().catch(error => {
                console.error("Fallo al reproducir el SFX de click:", error);
            });
        }
    }, [isMusicEnabled, sfxVolume]);

    useEffect(() => {
        const handleClickGlobal = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) {
                playClickSFX();
            } else if (target.tagName === 'A' || target.closest('a')) {
                playClickSFX();
            }
        };

        document.addEventListener('click', handleClickGlobal);

        return () => {
            document.removeEventListener('click', handleClickGlobal);
        };
    }, [playClickSFX]);

    return (
        <div style={{ display: 'none' }}>
            <audio
                ref={bgmRef}
                src={AUDIO_PATHS.BGM}
                preload="auto"
                loop
            />

            <audio
                ref={sfxRef}
                src={AUDIO_PATHS.CLICK_SFX}
                preload="auto"
            />
        </div>
    );
};

export default GameAudio;