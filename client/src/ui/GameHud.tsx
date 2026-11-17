import React from 'react';
import ProgressButton from '../Mundo-Gen/ProgressButton';

// Barra superior del cuarto y del mapa. Antes los botones quedaban chicos y
// arriba a la izquierda (las clases top-4/right-4 de Tailwind no se aplican).
// GO TO MAP pasa a ser la acción principal y se agrega HELP permanente (#04, #09).

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

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
                <span aria-hidden="true">🗺️</span> GO TO MAP
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
            <span aria-hidden="true">?</span> HELP
        </button>

        <button
            type="button"
            className="tt-hud__btn tt-hud__btn--logout"
            onClick={onLogout}
            disabled={disabled}
        >
            <LogOutIcon /> LOG OUT
        </button>
    </div>
);

export default GameHud;
