import { useEffect, useRef } from 'react';

// Dirección del sprite: 0 arriba, 1 abajo, 2 izquierda, 3 derecha
const KEY_DIRECTIONS: { [key: string]: number } = {
    'arrowup': 0, 'w': 0,
    'arrowdown': 1, 's': 1,
    'arrowleft': 2, 'a': 2,
    'arrowright': 3, 'd': 3,
};

// Evita saltos grandes si la pestaña estuvo en segundo plano
const MAX_FRAME_SECONDS = 0.05;

interface KeyboardMovementOptions {
    // false mientras haya un popup abierto: el personaje se detiene y no responde
    enabled: boolean;
    // Velocidad en píxeles del mapa por segundo
    speed: number;
    // dx/dy ya vienen escalados por el tiempo del cuadro; la pantalla aplica colisiones
    onMove: (dx: number, dy: number, direction: number) => void;
    onStop: () => void;
}

// Mueve al personaje mientras las teclas estén presionadas, en cada cuadro de
// animación, en lugar de depender de la repetición de teclas del sistema
// (que tiene ~0.5 s de retraso inicial y no permite dos teclas a la vez).
export const useKeyboardMovement = ({ enabled, speed, onMove, onStop }: KeyboardMovementOptions) => {
    // Teclas de movimiento presionadas, en el orden en que se presionaron
    const pressedKeys = useRef<string[]>([]);
    const callbacks = useRef({ onMove, onStop });
    callbacks.current = { onMove, onStop };

    useEffect(() => {
        const release = (key: string) => {
            pressedKeys.current = pressedKeys.current.filter(k => k !== key);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (KEY_DIRECTIONS[key] === undefined) return;
            event.preventDefault();
            if (!enabled || pressedKeys.current.includes(key)) return;
            pressedKeys.current = [...pressedKeys.current, key];
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            release(event.key.toLowerCase());
        };

        // Si la ventana pierde el foco no llega el keyup y el personaje seguiría caminando
        const handleBlur = () => {
            pressedKeys.current = [];
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        if (!enabled) {
            pressedKeys.current = [];
            callbacks.current.onStop();
        }

        let frameId = 0;
        let lastTime: number | null = null;
        let wasMoving = false;

        const step = (time: number) => {
            const seconds = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_FRAME_SECONDS);
            lastTime = time;

            const keys = pressedKeys.current;
            const isPressed = (direction: number) => keys.some(k => KEY_DIRECTIONS[k] === direction);
            const vx = (isPressed(3) ? 1 : 0) - (isPressed(2) ? 1 : 0);
            const vy = (isPressed(1) ? 1 : 0) - (isPressed(0) ? 1 : 0);

            if (vx === 0 && vy === 0) {
                if (wasMoving) {
                    wasMoving = false;
                    callbacks.current.onStop();
                }
            } else {
                wasMoving = true;
                // Normalizar para que en diagonal no se avance más rápido
                const length = Math.hypot(vx, vy);
                const distance = speed * seconds;
                // El sprite mira hacia la última tecla presionada
                const direction = KEY_DIRECTIONS[keys[keys.length - 1]];
                callbacks.current.onMove((vx / length) * distance, (vy / length) * distance, direction);
            }

            frameId = requestAnimationFrame(step);
        };

        if (enabled) {
            frameId = requestAnimationFrame(step);
        }

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [enabled, speed]);
};
