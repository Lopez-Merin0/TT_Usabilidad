import React, { useEffect, useState } from 'react';
import { getVoiceVolume, setVoiceVolume, VOICE_VOLUME_EVENT } from './audioSettings';

interface SoundControlProps {
    isMusicEnabled: boolean;
    musicVolume: number;
    onToggleMusic: () => void;
    onMusicVolumeChange: (value: number) => void;
}

// Control de sonido fijo abajo a la derecha (antes estaba arriba a la derecha
// y se encimaba con los botones de LOG OUT y el contador de preguntas).
// Música y voces se regulan por separado (hallazgos #03 y #22).
const SoundControl: React.FC<SoundControlProps> = ({
    isMusicEnabled,
    musicVolume,
    onToggleMusic,
    onMusicVolumeChange,
}) => {
    const [open, setOpen] = useState(false);
    const [voiceVolume, setVoiceVolumeState] = useState(getVoiceVolume);

    useEffect(() => {
        const onChange = (event: Event) => setVoiceVolumeState((event as CustomEvent).detail);
        window.addEventListener(VOICE_VOLUME_EVENT, onChange);
        return () => window.removeEventListener(VOICE_VOLUME_EVENT, onChange);
    }, []);

    return (
        <div className="tt-sound">
            {open && (
                <div className="tt-sound__panel" role="dialog" aria-label="Sound settings">
                    <p className="tt-sound__title">Sound <span className="tt-es">Sonido</span></p>

                    <label className="tt-sound__label" htmlFor="tt-music-volume">
                        🎵 Music <span className="tt-es">Música</span>: {isMusicEnabled ? `${Math.round(musicVolume * 100)}%` : 'OFF'}
                    </label>
                    <input
                        id="tt-music-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={musicVolume}
                        disabled={!isMusicEnabled}
                        onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                    />
                    <button type="button" className="tt-sound__mute" onClick={onToggleMusic}>
                        {isMusicEnabled ? '🔇 Mute music / Silenciar' : '🔊 Turn music on / Activar'}
                    </button>

                    <label className="tt-sound__label" htmlFor="tt-voice-volume">
                        🗣️ Voices <span className="tt-es">Voces</span>: {Math.round(voiceVolume * 100)}%
                    </label>
                    <input
                        id="tt-voice-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={voiceVolume}
                        onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                    />
                    <p className="tt-sound__hint">
                        Voices = listening audios. <span className="tt-es">Voces = audios para escuchar.</span>
                    </p>
                </div>
            )}

            <button
                type="button"
                className="tt-sound__toggle"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                title="Sound settings / Ajustes de sonido"
            >
                <span aria-hidden="true">{isMusicEnabled ? '🔊' : '🔇'}</span>
                <span>Sound</span>
            </button>
        </div>
    );
};

export default SoundControl;
