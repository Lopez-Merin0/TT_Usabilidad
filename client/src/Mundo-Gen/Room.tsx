import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardMovement } from './useKeyboardMovement';

import Character from './Character';
import LoadingScreen from '../LogIn/LoadingScreen';
import SleepPopup from '../components/Popups/SleepPopup';
import { checkRoomCollision } from '../utils/collisionUtils';
import { checkAllMinigamesCompleted } from '../utils/minigameUtils';
import { ROOM_COLLISION_AREAS } from '../Colisiones/RoomCollisionAreas';
import { WORLD_SPAWN_FROM_ROOM } from '../Colisiones/MiniGameTrigger';
import '../index.css';
import roomBackground from '../assets/mundo/cuarto.jpg';
import ConfirmationPopup from '../components/Popups/ConfirmationPopup';
import GameHud from '../ui/GameHud';
import GoalBanner from '../ui/GoalBanner';
import PixelExitSign from '../ui/PixelExitSign';
import Tutorial, { hasSeenTutorial } from '../ui/Tutorial';
import { getOverallProgress } from '../ui/gameProgress';

const ROOM_WIDTH = 500;  
const ROOM_HEIGHT = 300; 
const SCALE_FACTOR = 1.8;  // tamaño de la imagen

const BASE_SPRITE_SIZE = 16;
const CHARACTER_SCALE_FACTOR = 6;  // Reducido de 12 a 6 para hacer el personaje mucho más grande
const SCALED_SPRITE_SIZE = BASE_SPRITE_SIZE * CHARACTER_SCALE_FACTOR;

// Píxeles del cuarto por segundo (antes ~150 px/s, limitado por la repetición de teclas)
const MOVEMENT_SPEED = 190;
const DEBUG_MODE = false; // Cambiar a true temporalmente para ver qué pasa

// Zona de la salida del cuarto (pasillo de abajo a la derecha). Al caminar
// hasta aquí se pregunta si quiere ir al mapa, igual que con GO TO MAP (#13).
const ROOM_EXIT_ZONE = { xMin: 700, xMax: 850, yMin: 380, yMax: 540 };

const getUserName = (): string => {
    try {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data).username || 'Player' : 'Player';
    } catch {
        return 'Player';
    }
};

interface CharacterState {
    mapX: number;
    mapY: number;
    direction: number;
    frame: number;
    isMoving: boolean;
}

const Room: React.FC = () => {
    const navigate = useNavigate();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showMapPopup, setShowMapPopup] = useState(false);
    const [showSleepPopup, setShowSleepPopup] = useState(false);
    const [hasShownSleepPopup, setHasShownSleepPopup] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    // El tutorial se muestra solo la primera vez; después se abre con HELP
    const [showTutorial, setShowTutorial] = useState(() => !hasSeenTutorial());
    const [hasShownExitPopup, setHasShownExitPopup] = useState(false);

    const [viewport, setViewport] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const MAX_MAP_WIDTH = ROOM_WIDTH * SCALE_FACTOR;
    const MAX_MAP_HEIGHT = ROOM_HEIGHT * SCALE_FACTOR;

    const [characterState, setCharacterState] = useState<CharacterState>(() => ({
        mapX: 400,  // Posición inicial segura
        mapY: 400,  // Posición inicial segura
        direction: 1,
        frame: 0,
        isMoving: false,
    }));

    useEffect(() => {
        let interval: number | null = null;
        if (characterState.isMoving) {
            interval = window.setInterval(() => {
                setCharacterState((prev) => ({ ...prev, frame: (prev.frame + 1) % 4 }));
            }, 100);
        } else {
            setCharacterState((prev) => ({ ...prev, frame: 0 }));
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [characterState.isMoving]);

    const moveCharacter = useCallback((dx: number, dy: number, direction: number) => {
        setCharacterState((prev) => {
            const newX = prev.mapX + dx;
            const newY = prev.mapY + dy;

            const HALF_SPRITE = SCALED_SPRITE_SIZE / 2;
            const MIN_X = HALF_SPRITE;
            const MAX_X = MAX_MAP_WIDTH - HALF_SPRITE;
            const MIN_Y = HALF_SPRITE;
            const MAX_Y = MAX_MAP_HEIGHT - HALF_SPRITE;

            const limitedX = Math.max(MIN_X, Math.min(MAX_X, newX));
            const limitedY = Math.max(MIN_Y, Math.min(MAX_Y, newY));

            // Verificar colisiones (áreas donde NO puede pasar)
            const hasCollision = checkRoomCollision(limitedX, limitedY, SCALED_SPRITE_SIZE, ROOM_COLLISION_AREAS, DEBUG_MODE);

            let finalX = limitedX;
            let finalY = limitedY;

            if (hasCollision) {
                // Intentar moverse solo en X
                const tryX = checkRoomCollision(limitedX, prev.mapY, SCALED_SPRITE_SIZE, ROOM_COLLISION_AREAS, DEBUG_MODE);
                // Intentar moverse solo en Y
                const tryY = checkRoomCollision(prev.mapX, limitedY, SCALED_SPRITE_SIZE, ROOM_COLLISION_AREAS, DEBUG_MODE);

                if (!tryX) {
                    finalY = prev.mapY;
                } else if (!tryY) {
                    finalX = prev.mapX;
                } else {
                    finalX = prev.mapX;
                    finalY = prev.mapY;
                }
            }

            return {
                ...prev,
                mapX: finalX,
                mapY: finalY,
                direction,
                isMoving: true,
            };
        });
    }, [MAX_MAP_WIDTH, MAX_MAP_HEIGHT]);

    const stopCharacter = useCallback(() => {
        setCharacterState((prev) => (prev.isMoving ? { ...prev, isMoving: false } : prev));
    }, []);

    useKeyboardMovement({
        enabled: !(showIntro || showTutorial || showLogoutPopup || showSleepPopup || showMapPopup),
        speed: MOVEMENT_SPEED,
        onMove: moveCharacter,
        onStop: stopCharacter,
    });

    useEffect(() => {
        // Detener movimiento cuando aparezca un popup
        if (showLogoutPopup || showSleepPopup || showMapPopup) {
            setCharacterState(prev => ({ ...prev, isMoving: false, frame: 0 }));
        }
    }, [showLogoutPopup, showSleepPopup, showMapPopup]);

    useEffect(() => {
        const { mapX, mapY } = characterState;
        
        // Zona de la cama (dormir) - ÁREA ALREDEDOR de la cama, no sobre ella
        const isNearBed = (
            (mapX >= 50 && mapX <= 100 && mapY >= 280 && mapY <= 375) ||  // Lado izquierdo de la cama
            (mapX >= 250 && mapX <= 300 && mapY >= 280 && mapY <= 375) ||  // Lado derecho de la cama
            (mapX >= 100 && mapX <= 250 && mapY >= 240 && mapY <= 280) ||  // Arriba de la cama
            (mapX >= 100 && mapX <= 250 && mapY >= 375 && mapY <= 420)     // Abajo de la cama
        );
        const allMinigamesCompleted = checkAllMinigamesCompleted();
        
        if (isNearBed && allMinigamesCompleted && !showSleepPopup && !hasShownSleepPopup) {
            console.log('💤 Activando popup de dormir');
            setShowSleepPopup(true);
            setHasShownSleepPopup(true);
        } else if (!isNearBed && hasShownSleepPopup) {
            setHasShownSleepPopup(false);
        }
    }, [characterState.mapX, characterState.mapY, showSleepPopup, hasShownSleepPopup]);

    // Caminar a la puerta abre la misma confirmación que GO TO MAP
    useEffect(() => {
        const { mapX, mapY } = characterState;
        const inExit = mapX >= ROOM_EXIT_ZONE.xMin && mapX <= ROOM_EXIT_ZONE.xMax
            && mapY >= ROOM_EXIT_ZONE.yMin && mapY <= ROOM_EXIT_ZONE.yMax;

        if (inExit && !hasShownExitPopup && !showMapPopup && !showLogoutPopup && !showSleepPopup) {
            setShowMapPopup(true);
            setHasShownExitPopup(true);
        } else if (!inExit && hasShownExitPopup) {
            setHasShownExitPopup(false);
        }
    }, [characterState.mapX, characterState.mapY, hasShownExitPopup, showMapPopup, showLogoutPopup, showSleepPopup]);

    if (showIntro) {
        return <LoadingScreen onAnimationEnd={() => setShowIntro(false)} />;
    }

    const overall = getOverallProgress();
    const anyPopupOpen = showLogoutPopup || showSleepPopup || showMapPopup || showTutorial;

    return (
        <div
            className="relative w-screen h-screen overflow-hidden"
            style={{ 
                backgroundColor: '#000000',
            }}
        >
            {/* Contenedor de la imagen de fondo del cuarto */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${MAX_MAP_WIDTH}px`,
                    height: `${MAX_MAP_HEIGHT}px`,
                    backgroundImage: `url(${roomBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                }}
            />

            {/* Indicador de la salida (#13) */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${MAX_MAP_WIDTH}px`,
                    height: `${MAX_MAP_HEIGHT}px`,
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            >
                <PixelExitSign
                    style={{
                        left: `${(ROOM_EXIT_ZONE.xMin + ROOM_EXIT_ZONE.xMax) / 2}px`,
                        bottom: `${MAX_MAP_HEIGHT - ROOM_EXIT_ZONE.yMax + 8}px`,
                        transform: 'translateX(-50%)',
                    }}
                />
            </div>

            {/* Debug: Mostrar áreas de colisión */}
            {DEBUG_MODE && (
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: `${MAX_MAP_WIDTH}px`, height: `${MAX_MAP_HEIGHT}px`, pointerEvents: 'none', zIndex: 5 }}>
                    {ROOM_COLLISION_AREAS.map((area, index) => (
                        <div
                            key={`collision-${index}`}
                            style={{
                                position: 'absolute',
                                left: `${area.topLeft.x}px`,
                                top: `${area.topLeft.y}px`,
                                width: `${area.bottomRight.x - area.topLeft.x}px`,
                                height: `${area.bottomRight.y - area.topLeft.y}px`,
                                border: '2px solid red',
                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                pointerEvents: 'none',
                            }}
                        />
                    ))}
                    
                    {/* Zona de dormir en morado - ALREDEDOR de la cama */}
                    {checkAllMinigamesCompleted() && (
                        <>
                            {/* Lado izquierdo */}
                            <div style={{ position: 'absolute', left: '50px', top: '280px', width: '50px', height: '95px', border: '3px solid purple', backgroundColor: 'rgba(147, 112, 219, 0.2)', pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#9370DB', padding: '2px 5px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>💤</div>
                            </div>
                            {/* Lado derecho */}
                            <div style={{ position: 'absolute', left: '250px', top: '280px', width: '50px', height: '95px', border: '3px solid purple', backgroundColor: 'rgba(147, 112, 219, 0.2)', pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#9370DB', padding: '2px 5px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>💤</div>
                            </div>
                            {/* Arriba */}
                            <div style={{ position: 'absolute', left: '100px', top: '240px', width: '150px', height: '40px', border: '3px solid purple', backgroundColor: 'rgba(147, 112, 219, 0.2)', pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#9370DB', padding: '2px 5px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>💤</div>
                            </div>
                            {/* Abajo */}
                            <div style={{ position: 'absolute', left: '100px', top: '375px', width: '150px', height: '45px', border: '3px solid purple', backgroundColor: 'rgba(147, 112, 219, 0.2)', pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#9370DB', padding: '2px 5px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>💤</div>
                            </div>
                        </>
                    )}
                </div>
            )}

            <Character
                x={(viewport.width / 2) + (characterState.mapX - MAX_MAP_WIDTH / 2) - SCALED_SPRITE_SIZE / 2}
                y={(viewport.height / 2) + (characterState.mapY - MAX_MAP_HEIGHT / 2) - SCALED_SPRITE_SIZE / 2}
                style={{ zIndex: 1, position: 'absolute' }}
                direction={characterState.direction}
                frame={characterState.frame}
            />

            <GameHud
                disabled={anyPopupOpen}
                onGoToMap={() => setShowMapPopup(true)}
                onHelp={() => setShowTutorial(true)}
                onLogout={() => setShowLogoutPopup(true)}
            />

            {!anyPopupOpen && (
                overall.next ? (
                    <GoalBanner
                        text={<>Go to the town map and find <b>{overall.next.name}</b> ⭐</>}
                        textEs={`Ve al mapa del pueblo y busca ${overall.next.nameEs}. Sal por la puerta (EXIT) o con GO TO MAP.`}
                    />
                ) : (
                    <GoalBanner
                        text={<>All activities done! Walk to your <b>bed</b> to rest 💤</>}
                        textEs="¡Completaste todo! Camina a tu cama para descansar."
                    />
                )
            )}

            {showMapPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="kawaii-popup p-6 rounded-lg shadow-lg text-center"
                        style={{
                            backgroundColor: '#fefefe',
                            border: '5px solid #32CD32',
                            boxShadow: '0 8px 0 0 #90EE90',
                            maxWidth: '400px',
                        }}>
                        <p className="text-xl font-bold" style={{ color: '#333333', marginBottom: '4px' }}>
                            Do you want to go to the map?
                        </p>
                        <p className="tt-es" style={{ marginBottom: '16px' }}>¿Quieres ir al mapa del pueblo?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    setShowMapPopup(false);
                                    localStorage.setItem('worldCharacterPosition', JSON.stringify(WORLD_SPAWN_FROM_ROOM));
                                    navigate('/world');
                                }}
                                className="kawaii-button py-2 px-4 font-bold"
                                style={{
                                    backgroundColor: '#90EE90',
                                    color: '#333333',
                                    border: '3px solid #32CD32',
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => setShowMapPopup(false)}
                                className="kawaii-button py-2 px-4 font-bold"
                                style={{
                                    backgroundColor: '#add8e6',
                                    color: '#333333',
                                    border: '3px solid #6495ed',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutPopup && (
                <ConfirmationPopup 
                    onConfirm={() => {
                        setShowLogoutPopup(false);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userData');
                        navigate('/', { replace: true });
                    }} 
                    onCancel={() => setShowLogoutPopup(false)} 
                />
            )}

            {showSleepPopup && (
                <SleepPopup onClose={() => setShowSleepPopup(false)} />
            )}

            {showTutorial && (
                <Tutorial userName={getUserName()} onClose={() => setShowTutorial(false)} />
            )}

            {DEBUG_MODE && (
                <div
                    className="absolute top-1 left-1 p-2 text-xs font-bold rounded"
                    style={{
                        zIndex: 10,
                        backgroundColor: '#add8e6',
                        color: '#333333',
                        border: '2px solid #6495ed',
                        boxShadow: '2px 2px 0px #6495ed',
                    }}
                >
                    Pos: ({Math.round(characterState.mapX)}, {Math.round(characterState.mapY)})
                </div>
            )}
        </div>
    );
};

export default Room;
