import React from 'react';
import { TRIGGER_AREAS } from '../Colisiones/MiniGameTrigger';
import { NPC_TRIGGER_AREAS } from '../NPC/NPCTriggerAreas';
import { getOverallProgress, MinigameKey } from './gameProgress';

// Indicadores visuales sobre el mapa del pueblo:
// - Casas con minijuego: etiqueta con estado (⭐ siguiente, ✅ completado, 🔒 bloqueado) (#15)
// - Puertas/zonas donde hay que caminar para entrar: brillo punteado (#06)
// - Animales con consejos: burbuja 💬 (#06)
// - Flecha amarilla junto al personaje que apunta al siguiente destino (#05)
// Todo se dibuja en coordenadas del mapa, dentro del mismo contenedor escalado.

type Area = { xMin: number; xMax: number; yMin: number; yMax: number };

const center = (area: Area) => ({
    x: (area.xMin + area.xMax) / 2,
    y: (area.yMin + area.yMax) / 2,
});

const GAME_LABELS: Record<MinigameKey, string> = {
    FirstMinigame: 'Word Hunt',
    SecondMinigame: 'Verb Workshop',
    ThirdMinigame: 'Sweet Sounds',
};

// Separación entre la zona de entrada y la etiqueta que va encima
const LABEL_GAP = 6;
// Distancia del personaje a la que ya no se muestra la flecha
const ARROW_HIDE_DISTANCE = 70;
const ARROW_RADIUS = 44;

interface WorldGuidesProps {
    translateX: number;
    translateY: number;
    characterX: number;
    characterY: number;
    showArrow: boolean;
}

const Spot: React.FC<{ area: Area; tx: number; ty: number; variant?: 'npc' | 'locked' }> = ({ area, tx, ty, variant }) => {
    const width = area.xMax - area.xMin + 22;
    const height = area.yMax - area.yMin + 14;
    const c = center(area);
    return (
        <div
            className={`tt-spot${variant ? ` tt-spot--${variant}` : ''}`}
            style={{
                left: c.x + tx - width / 2,
                top: c.y + ty - height / 2,
                width,
                height,
            }}
        />
    );
};

const Marker: React.FC<{ x: number; y: number; variant: string; children: React.ReactNode }> = ({ x, y, variant, children }) => (
    <div className={`tt-marker tt-marker--${variant}`} style={{ left: x, top: y }}>
        <span className="tt-marker__tag">{children}</span>
        <span className="tt-marker__pin" />
    </div>
);

const WorldGuides: React.FC<WorldGuidesProps> = ({ translateX: tx, translateY: ty, characterX, characterY, showArrow }) => {
    const progress = getOverallProgress();
    const allDone = progress.next === null;

    // Destino de la flecha: el siguiente minijuego o, si ya terminó todo, su casa
    const targetArea: Area = allDone
        ? TRIGGER_AREAS.RoomMinigame
        : TRIGGER_AREAS[progress.next!.key];
    const target = center(targetArea);
    const dx = target.x - characterX;
    const dy = target.y - characterY;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    return (
        <>
            {progress.games.map((game) => {
                const area = TRIGGER_AREAS[game.key];
                const c = center(area);
                const isNext = progress.next?.key === game.key;
                const variant = game.isCompleted ? 'done' : isNext ? 'next' : 'locked';
                const icon = game.isCompleted ? '✅' : isNext ? '⭐' : '🔒';
                return (
                    <React.Fragment key={game.key}>
                        <Spot area={area} tx={tx} ty={ty} variant={variant === 'locked' ? 'locked' : undefined} />
                        <Marker x={c.x + tx} y={area.yMin + ty - LABEL_GAP} variant={variant}>
                            {icon} {GAME_LABELS[game.key]}
                        </Marker>
                    </React.Fragment>
                );
            })}

            {/* Casa del jugador */}
            <Spot area={TRIGGER_AREAS.RoomMinigame} tx={tx} ty={ty} />
            <Marker
                x={center(TRIGGER_AREAS.RoomMinigame).x + tx}
                y={TRIGGER_AREAS.RoomMinigame.yMin + ty - LABEL_GAP}
                variant={allDone ? 'next' : 'home'}
            >
                🏠 My Room{allDone ? ' 💤' : ''}
            </Marker>

            {/* Animales con consejos */}
            {NPC_TRIGGER_AREAS.map((npc) => {
                const area: Area = {
                    xMin: npc.topLeft.x,
                    xMax: npc.bottomRight.x,
                    yMin: npc.topLeft.y,
                    yMax: npc.bottomRight.y,
                };
                const c = center(area);
                return (
                    <React.Fragment key={npc.npcId}>
                        <Spot area={area} tx={tx} ty={ty} variant="npc" />
                        <Marker x={c.x + tx} y={area.yMin + ty - 2} variant="npc">💬</Marker>
                    </React.Fragment>
                );
            })}

            {/* Flecha guía al siguiente destino */}
            {showArrow && distance > ARROW_HIDE_DISTANCE && (
                <div
                    className="tt-guide-arrow"
                    aria-hidden="true"
                    style={{
                        left: characterX + tx + Math.cos(angle) * ARROW_RADIUS,
                        top: characterY + ty + Math.sin(angle) * ARROW_RADIUS,
                        transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    }}
                >
                    ➤
                </div>
            )}
        </>
    );
};

export default WorldGuides;
