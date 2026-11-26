import React from 'react';
import ProgressButton from '../Mundo-Gen/ProgressButton';
import Icon from './Icon';

// Barra superior del cuarto y del mapa. Antes los botones quedaban chicos y
// arriba a la izquierda (las clases top-4/right-4 de Tailwind no se aplican).
// GO TO MAP pasa a ser la acción principal y se agrega HELP permanente (#04, #09).
// v3: íconos propios en lugar de emojis; LOG OUT en rojo como acción de salida.

interface GameHudProps {
    disabled?: boolean;
    onGoToMap?: () => void;
    onHelp: () => void;
    onLogout: () => void;
}

const GameHud: React.FC<GameHudProps> = ({ disabled = false, onGoToMap, onHelp, onLogout }) => (
    <div className="tt-hud">
        {onGoToMap && (
            <button
                type="button"
                className="tt-hud__btn tt-hud__btn--map"
                onClick={onGoToMap}
                disabled={disabled}
            >
                <Icon name="mapa" size="1.6em" /> GO TO MAP
            </button>
        )}

        <ProgressButton disabled={disabled} />

        <button
            type="button"
            className="tt-hud__btn tt-hud__btn--help"
            onClick={onHelp}
            disabled={disabled}
            title="How to play / Cómo jugar"
        >
            <Icon name="ayuda" size="1.4em" /> HELP
        </button>

        <button
            type="button"
            className="tt-hud__btn tt-hud__btn--logout"
            onClick={onLogout}
            disabled={disabled}
        >
            <Icon name="salir" size="1.4em" /> LOG OUT
        </button>
    </div>
);

export default GameHud;
