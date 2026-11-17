import React, { useCallback, useEffect, useState } from 'react';

// Apoyos compartidos por los tres minijuegos:
// - Botón para mostrar apoyo en español sin quitar el inglés (#07)
// - Pistas progresivas que el usuario pide voluntariamente (#08)
// - Ejemplo de cómo jugar antes de empezar, reabrible con "How to play" (#18)

export interface Bilingual {
    en: string;
    es: string;
}

/* ---------------------------------------------------------------- Español */

const SPANISH_KEY = 'tt_show_spanish';

export const useSpanishSupport = (): [boolean, () => void] => {
    const [showSpanish, setShowSpanish] = useState<boolean>(() => {
        try {
            return localStorage.getItem(SPANISH_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const toggle = useCallback(() => {
        setShowSpanish((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(SPANISH_KEY, String(next));
            } catch {
                // sin almacenamiento: solo dura esta pantalla
            }
            return next;
        });
    }, []);

    return [showSpanish, toggle];
};

// Traducción que aparece debajo del texto en inglés cuando el apoyo está activo
export const EsText: React.FC<{ show: boolean; children?: React.ReactNode; block?: boolean }> = ({ show, children, block = true }) => {
    if (!show || !children) return null;
    const Tag = block ? 'p' : 'span';
    return <Tag className="tt-mg-es">{children}</Tag>;
};

/* ---------------------------------------------------------- Cómo jugar */

const howToKey = (gameKey: string) => `tt_howto_seen_${gameKey}`;

export const useHowToPlay = (gameKey: string, ready: boolean) => {
    const [show, setShow] = useState(false);

    // Se abre solo la primera vez que entra a ese minijuego (cuando termina la animación)
    useEffect(() => {
        if (!ready) return;
        try {
            if (localStorage.getItem(howToKey(gameKey)) !== 'true') setShow(true);
        } catch {
            setShow(true);
        }
    }, [gameKey, ready]);

    const close = useCallback(() => {
        try {
            localStorage.setItem(howToKey(gameKey), 'true');
        } catch {
            // nada
        }
        setShow(false);
    }, [gameKey]);

    return { showHowTo: show, openHowTo: () => setShow(true), closeHowTo: close };
};

export interface HowToStep {
    icon: string;
    en: React.ReactNode;
    es: string;
}

interface HowToPlayModalProps {
    title: string;
    titleEs: string;
    steps: HowToStep[];
    example: React.ReactNode;
    onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ title, titleEs, steps, example, onClose }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="tt-overlay" role="dialog" aria-modal="true" aria-labelledby="tt-howto-title">
            <div className="tt-card tt-howto">
                <h2 id="tt-howto-title" className="tt-card__title">{title}</h2>
                <p className="tt-card__subtitle-es">{titleEs}</p>

                <div className="tt-howto__example">
                    <p className="tt-howto__example-label">Example <span className="tt-es">Ejemplo</span></p>
                    {example}
                </div>

                <ol className="tt-howto__steps">
                    {steps.map((step, i) => (
                        <li key={i}>
                            <span className="tt-howto__step-icon" aria-hidden="true">{step.icon}</span>
                            <span>
                                {step.en}
                                <span className="tt-howto__step-es">{step.es}</span>
                            </span>
                        </li>
                    ))}
                </ol>

                <div className="tt-card__actions">
                    <button type="button" className="tt-btn tt-btn--primary" onClick={onClose} autoFocus>
                        Got it! <span className="tt-es">¡Entendido!</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Pasos comunes a los tres minijuegos (el primero cambia en cada uno)
export const commonSteps = (first: HowToStep): HowToStep[] => [
    first,
    {
        icon: '👆',
        en: <>Click the option you think is correct. <b>You can change it</b> before checking.</>,
        es: 'Haz clic en la opción que creas correcta. Puedes cambiarla antes de comprobar.',
    },
    {
        icon: '✔️',
        en: <>Press <b>CHECK ANSWER</b> to confirm. You have 2 attempts per question.</>,
        es: 'Presiona CHECK ANSWER para confirmar. Tienes 2 intentos por pregunta.',
    },
    {
        icon: '💡',
        en: <>Stuck? Press <b>Hint</b> (up to 2 per question). Press <b>Español</b> to see Spanish help.</>,
        es: '¿Atorado? Presiona Hint para una pista (hasta 2 por pregunta). Presiona Español para ver apoyo en español.',
    },
];

// Recuadro falso de "CHECK ANSWER" para los ejemplos
export const ExampleCheckButton: React.FC = () => (
    <span className="tt-howto__mock-check">✔ CHECK ANSWER</span>
);

/* ------------------------------------------------------- Barra de apoyos */

interface AssistToolbarProps {
    showSpanish: boolean;
    onToggleSpanish: () => void;
    onHowTo: () => void;
    hintsUsed: number;
    hintsTotal: number;
    onHint: () => void;
    canHint: boolean;
}

export const AssistToolbar: React.FC<AssistToolbarProps> = ({
    showSpanish,
    onToggleSpanish,
    onHowTo,
    hintsUsed,
    hintsTotal,
    onHint,
    canHint,
}) => (
    <div className="tt-assist" role="toolbar" aria-label="Help tools">
        <button
            type="button"
            className="tt-assist__btn tt-assist__btn--hint"
            onClick={onHint}
            disabled={!canHint || hintsUsed >= hintsTotal}
            title="Get a hint / Pedir una pista"
        >
            💡 Hint {hintsUsed}/{hintsTotal}
        </button>
        <button
            type="button"
            className={`tt-assist__btn tt-assist__btn--es${showSpanish ? ' is-on' : ''}`}
            onClick={onToggleSpanish}
            aria-pressed={showSpanish}
            title="Show Spanish help / Mostrar apoyo en español"
        >
            🌎 Español {showSpanish ? 'ON' : 'OFF'}
        </button>
        <button
            type="button"
            className="tt-assist__btn tt-assist__btn--howto"
            onClick={onHowTo}
            title="How to play / Cómo jugar"
        >
            ❓ How to play
        </button>
    </div>
);

/* ----------------------------------------------------------------- Pistas */

export const HintBox: React.FC<{ hints: Bilingual[]; used: number; showSpanish: boolean }> = ({ hints, used, showSpanish }) => {
    if (used <= 0) return null;
    return (
        <div className="tt-hintbox" role="status" aria-live="polite">
            {hints.slice(0, used).map((hint, i) => (
                <p key={i} className="tt-hintbox__item">
                    <b>💡 Hint {i + 1}:</b> {hint.en}
                    {showSpanish && <span className="tt-mg-es"> {hint.es}</span>}
                </p>
            ))}
            {used >= 2 && (
                <p className="tt-hintbox__item tt-hintbox__item--small">
                    One wrong option was removed. <span className="tt-mg-es">Se quitó una opción incorrecta.</span>
                </p>
            )}
        </div>
    );
};

/* ---------------------------------------- Selección + confirmación (#14) */

// Estado de la respuesta seleccionada antes de confirmar, y de las pistas,
// que se reinician en cada pregunta.
export const useAnswerSelection = <T extends { id: number; isCorrect: boolean }>(
    questionId: number | undefined,
    options: T[],
    isAnswered: boolean,
) => {
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [hintsUsed, setHintsUsed] = useState(0);

    useEffect(() => {
        setPendingId(null);
        setHintsUsed(0);
    }, [questionId]);

    // Al pasar al siguiente intento se limpia la selección
    useEffect(() => {
        if (!isAnswered) setPendingId(null);
    }, [isAnswered]);

    // Con la segunda pista se quita una opción incorrecta (la última incorrecta de la lista)
    const eliminatedId = hintsUsed >= 2
        ? [...options].reverse().find((o) => !o.isCorrect && o.id !== pendingId)?.id ?? null
        : null;

    const pendingOption = options.find((o) => o.id === pendingId) ?? null;

    return {
        pendingId,
        setPendingId,
        pendingOption,
        hintsUsed,
        takeHint: () => setHintsUsed((n) => n + 1),
        eliminatedId,
    };
};

interface CheckAnswerButtonProps {
    disabled: boolean;
    onCheck: () => void;
    style: React.CSSProperties;
    showSpanish: boolean;
}

export const CheckAnswerButton: React.FC<CheckAnswerButtonProps> = ({ disabled, onCheck, style, showSpanish }) => (
    <div className="tt-check">
        {disabled && (
            <span className="tt-check__hint">
                Choose an option first{showSpanish ? ' · Primero elige una opción' : ''}
            </span>
        )}
        <button
            type="button"
            onClick={onCheck}
            disabled={disabled}
            style={{
                ...style,
                alignSelf: 'auto',
                marginTop: 0,
                opacity: disabled ? 0.55 : 1,
                cursor: disabled ? 'default' : 'pointer',
            }}
        >
            ✔ Check answer
        </button>
    </div>
);
