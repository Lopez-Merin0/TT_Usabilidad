import React, { useEffect, useState } from 'react';
import Icon, { IconName } from './Icon';

// Tutorial breve que aparece la primera vez que el jugador entra al cuarto
// y que se puede volver a abrir en cualquier momento con el botón HELP
// (hallazgos #04, #05 y #09). Texto en inglés con apoyo en español.

// La marca de "ya vio el tutorial" se guarda por cuenta, no por navegador: así cada
// cuenta nueva lo ve una vez aunque varias personas usen la misma computadora
// (por ejemplo, en las pruebas de usabilidad), y quien regresa no lo vuelve a ver.
const TUTORIAL_SEEN_PREFIX = 'tt_tutorial_seen:';

const tutorialKey = (): string => {
    try {
        const data = JSON.parse(localStorage.getItem('userData') || '{}');
        const who = data.id ?? data._id ?? data.email ?? data.username ?? 'anon';
        return TUTORIAL_SEEN_PREFIX + String(who);
    } catch {
        return TUTORIAL_SEEN_PREFIX + 'anon';
    }
};

export const hasSeenTutorial = (): boolean => {
    try {
        return localStorage.getItem(tutorialKey()) === 'true';
    } catch {
        return false;
    }
};

const markTutorialSeen = () => {
    try {
        localStorage.setItem(tutorialKey(), 'true');
    } catch {
        // sin almacenamiento: se volverá a mostrar la próxima vez
    }
};

const Key: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => (
    <span className={`tt-key${wide ? ' tt-key--wide' : ''}`}>{children}</span>
);

interface Step {
    icon: React.ReactNode;
    title: string;
    titleEs: string;
    body: React.ReactNode;
    bodyEs: React.ReactNode;
}

const BigIcon: React.FC<{ name: IconName }> = ({ name }) => (
    <Icon name={name} size={84} className="tt-tutorial__img" />
);

const buildSteps = (userName: string): Step[] => [
    {
        icon: <BigIcon name="saludo" />,
        title: `Welcome to Talkie Town, ${userName}!`,
        titleEs: '¡Bienvenido/a a Talkie Town!',
        body: 'You will practice English by exploring the town and completing 3 activities: Word Hunt, Verb Workshop and Sweet Sounds.',
        bodyEs: 'Practicarás inglés explorando el pueblo y completando 3 actividades.',
    },
    {
        icon: (
            <div className="tt-tutorial__keys">
                <div className="tt-tutorial__keyrow"><Key>↑</Key></div>
                <div className="tt-tutorial__keyrow"><Key>←</Key><Key>↓</Key><Key>→</Key></div>
                <p className="tt-tutorial__or">or / o</p>
                <div className="tt-tutorial__keyrow"><Key>W</Key></div>
                <div className="tt-tutorial__keyrow"><Key>A</Key><Key>S</Key><Key>D</Key></div>
            </div>
        ),
        title: 'Move your character',
        titleEs: 'Mueve a tu personaje',
        body: 'Hold the arrow keys or W A S D to walk. You can move in diagonal too.',
        bodyEs: 'Mantén presionadas las flechas o W A S D para caminar. También puedes moverte en diagonal.',
    },
    {
        icon: <BigIcon name="salir" />,
        title: 'Leave your room',
        titleEs: 'Sal de tu cuarto',
        body: (
            <>Walk to the <b>EXIT</b> door, or press the green <b><Icon name="mapa" /> GO TO MAP</b> button at the top.</>
        ),
        bodyEs: 'Camina a la puerta de salida (EXIT) o presiona el botón verde GO TO MAP de arriba.',
    },
    {
        icon: <BigIcon name="estrella" />,
        title: 'Find the activities',
        titleEs: 'Encuentra las actividades',
        body: (
            <>Houses with a <b><Icon name="estrella" /> star</b> have an activity. Follow the <b>yellow arrow <Icon name="flecha" /></b> to your next one and walk to the glowing door to enter. Activities unlock in order.</>
        ),
        bodyEs: 'Las casas con estrella tienen una actividad. Sigue la flecha amarilla hacia la siguiente y camina a la puerta que brilla para entrar. Se desbloquean en orden.',
    },
    {
        icon: <BigIcon name="dialogo" />,
        title: 'Talk to the animals',
        titleEs: 'Habla con los animales',
        body: <>Animals with a <Icon name="dialogo" /> bubble give you tips to learn English. Walk next to them to talk.</>,
        bodyEs: <>Los animales con una burbuja <Icon name="dialogo" /> te dan consejos. Camina junto a ellos para hablar.</>,
    },
    {
        icon: <BigIcon name="ayuda" />,
        title: 'Need help?',
        titleEs: '¿Necesitas ayuda?',
        body: (
            <><b><Icon name="trofeo" /> PROGRESS</b> shows how much you have completed. <b><Icon name="ayuda" /> HELP</b> opens this guide again. <b><Icon name="sonido" /> Sound</b> (bottom right) changes music and voice volume.</>
        ),
        bodyEs: 'PROGRESS muestra tu avance. HELP abre esta guía otra vez. Sound (abajo a la derecha) cambia el volumen de música y voces.',
    },
];

interface TutorialProps {
    userName?: string;
    onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ userName = 'Player', onClose }) => {
    const steps = buildSteps(userName);
    const [index, setIndex] = useState(0);
    const step = steps[index];
    const isLast = index === steps.length - 1;

    const close = () => {
        markTutorialSeen();
        onClose();
    };

    // Teclado: → / Enter avanza, ← regresa, Esc cierra.
    // Se captura antes que el movimiento del personaje para no caminar detrás del tutorial.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const handled = ['arrowright', 'enter', 'arrowleft', 'escape', 'arrowup', 'arrowdown', 'w', 'a', 's', 'd'];
            if (!handled.includes(key)) return;
            e.preventDefault();
            e.stopPropagation();
            if (key === 'arrowright' || key === 'enter') {
                if (isLast) close(); else setIndex((i) => i + 1);
            } else if (key === 'arrowleft') {
                setIndex((i) => Math.max(0, i - 1));
            } else if (key === 'escape') {
                close();
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLast]);

    return (
        <div className="tt-overlay" role="dialog" aria-modal="true" aria-labelledby="tt-tutorial-title">
            <div className="tt-card tt-tutorial">
                <p className="tt-tutorial__counter">Step {index + 1} of {steps.length} · Paso {index + 1} de {steps.length}</p>

                <div className="tt-tutorial__icon">{step.icon}</div>

                <h2 id="tt-tutorial-title" className="tt-card__title">{step.title}</h2>
                <p className="tt-card__subtitle-es">{step.titleEs}</p>

                <p className="tt-tutorial__body">{step.body}</p>
                <p className="tt-tutorial__body-es">{step.bodyEs}</p>

                <div className="tt-tutorial__dots" aria-hidden="true">
                    {steps.map((_, i) => (
                        <span key={i} className={`tt-tutorial__dot${i === index ? ' is-active' : ''}`} />
                    ))}
                </div>

                <div className="tt-card__actions">
                    <button type="button" className="tt-btn tt-btn--ghost" onClick={close}>
                        Skip <span className="tt-es">Omitir</span>
                    </button>
                    {index > 0 && (
                        <button type="button" className="tt-btn tt-btn--secondary" onClick={() => setIndex(index - 1)}>
                            ← Back
                        </button>
                    )}
                    <button
                        type="button"
                        className="tt-btn tt-btn--primary"
                        onClick={() => (isLast ? close() : setIndex(index + 1))}
                        autoFocus
                    >
                        {isLast ? "Let's play! ¡A jugar!" : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
