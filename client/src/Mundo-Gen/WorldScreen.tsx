import React, { useState, useEffect, useCallback } from 'react';
import { useKeyboardMovement } from './useKeyboardMovement';
import { useNavigate } from 'react-router-dom';
import Character from './Character';
import CollisionDebugger from '../Colisiones/CollisionDebugger';
import { usePopupTrigger } from '../Colisiones/MiniGameTrigger';
import LoadingScreen from '../LogIn/LoadingScreen';
import NPCDialoguePopup from '../NPC/NPCDialoguePopup';
import { NPC_LIST, NPCDialogue } from '../NPC/NPCConfig';
import GameHud from '../ui/GameHud';
import GoalBanner from '../ui/GoalBanner';
import Icon from '../ui/Icon';
import Tutorial from '../ui/Tutorial';
import WorldGuides from '../ui/WorldGuides';
import { getOverallProgress } from '../ui/gameProgress';
import ConfirmationPopup from '../components/Popups/ConfirmationPopup';
import MiniGameConfirmationPopup from '../components/Popups/MiniGameConfirmationPopup';
import CompletedMinigamePopup from '../components/Popups/CompletedMinigamePopup';
import AllMinigamesCompletedPopup from '../components/Popups/AllMinigamesCompletedPopup';
import LockedMinigamePopup from '../components/Popups/LockedMinigamePopup';
import { checkCollision } from '../utils/collisionUtils';
import { checkMinigameUnlocked, checkMinigameCompleted, checkAllMinigamesCompleted, hasSeenAllCompletedPopup, markAllCompletedPopupAsSeen } from '../utils/minigameUtils';
import { checkNPCTrigger } from '../utils/npcTriggerUtils';
import '../index.css';
import { COLLISION_AREAS } from '../Colisiones/CollisionAreas';
import background from '../assets/mundo/fondo.jpeg';

const DEBUG_MODE = false; // Activar temporalmente para encontrar la zona correcta

const BACKGROUND_URL = background;

const MAP_WIDTH = 1024;
const MAP_HEIGHT = 640;
const SCALE_FACTOR = 1.4;

const BASE_SPRITE_SIZE = 16;
const CHARACTER_SCALE_FACTOR = 1;
const SCALED_SPRITE_SIZE = BASE_SPRITE_SIZE * CHARACTER_SCALE_FACTOR;

// El sprite se dibuja de 112 px (Character.tsx) pero se posiciona restando solo
// SCALED_SPRITE_SIZE / 2 = 8 px, así que el personaje se ve ~48 px abajo y a la
// derecha de su posición lógica. Las zonas de minijuegos y NPC están calibradas
// con lo que se ve, así que los indicadores del mapa usan el mismo desfase.
const CHARACTER_VISUAL_OFFSET = 112 / 2 - SCALED_SPRITE_SIZE / 2;

// Píxeles del mapa por segundo (antes ~105 px/s, limitado por la repetición de teclas)
const MOVEMENT_SPEED = 200;
const CUSTOM_MAX_X_POS = 1344;
const CUSTOM_MAX_Y_POS = 840;

const MINIGAME_ROUTES: { [key: string]: string } = {
    FirstMinigame: '/primer mini juego',
    SecondMinigame: '/segundo mini juego',
    ThirdMinigame: '/tercer mini juego',
    RoomMinigame: '/mi cuarto',
};

const MINIGAME_NAMES: { [key: string]: string } = {
    FirstMinigame: 'Word Hunt',
    SecondMinigame: 'Verb Workshop',
    ThirdMinigame: 'Sweet Sounds',
    RoomMinigame: 'My Room',
};

interface CharacterState {
    mapX: number;
    mapY: number;
    direction: number;
    frame: number;
    isMoving: boolean;
}

const getStoredUserName = (): string => {
    try {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data).username || 'Player' : 'Player';
    } catch {
        return 'Player';
    }
};

const WorldScreen: React.FC = () => {
    const navigate = useNavigate();

    const [showIntro, setShowIntro] = useState(true);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [miniGamePopupState, setMiniGamePopupState] = useState<{ isVisible: boolean; targetRoute: string; gameName: string; } | null>(null);
    const [completedMinigamePopup, setCompletedMinigamePopup] = useState<{ isVisible: boolean; gameName: string; } | null>(null);
    const [showAllCompletedPopup, setShowAllCompletedPopup] = useState(false);
    const [npcDialogue, setNpcDialogue] = useState<{ npcName: string; dialogue: NPCDialogue } | null>(null);
    const [hasShownPopupForTrigger, setHasShownPopupForTrigger] = useState<string | null>(null);
    const [lockedMessage, setLockedMessage] = useState<string | null>(null);
    const [currentNPCTrigger, setCurrentNPCTrigger] = useState<string | null>(null);
    const [lastNPCTrigger, setLastNPCTrigger] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    const [viewport, setViewport] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const MAX_MAP_WIDTH = MAP_WIDTH * SCALE_FACTOR;
    const MAX_MAP_HEIGHT = MAP_HEIGHT * SCALE_FACTOR;

    const [characterState, setCharacterState] = useState<CharacterState>(() => {
        const savedPosition = localStorage.getItem('worldCharacterPosition');
        if (savedPosition) {
            try {
                const parsed = JSON.parse(savedPosition);
                return {
                    mapX: parsed.mapX || 1070,
                    mapY: parsed.mapY || 810,
                    direction: parsed.direction || 1,
                    frame: 0,
                    isMoving: false,
                };
            } catch (error) {
                console.error('Error al parsear posición guardada:', error);
            }
        }
        return { mapX: 1070, mapY: 810, direction: 1, frame: 0, isMoving: false };
    });

    useEffect(() => {
        const positionData = {
            mapX: characterState.mapX,
            mapY: characterState.mapY,
            direction: characterState.direction,
        };
        localStorage.setItem('worldCharacterPosition', JSON.stringify(positionData));
    }, [characterState.mapX, characterState.mapY, characterState.direction]);

    const isPopupTriggered: string | null = usePopupTrigger({
        mapX: characterState.mapX,
        mapY: characterState.mapY,
    });

    useEffect(() => {
        if (isPopupTriggered && !miniGamePopupState && !completedMinigamePopup && !showLogoutPopup && !lockedMessage && isPopupTriggered !== hasShownPopupForTrigger) {
            const targetRoute = MINIGAME_ROUTES[isPopupTriggered];
            if (targetRoute) {
                // Primero verificar si está completado
                const isCompleted = checkMinigameCompleted(isPopupTriggered);
                
                if (isCompleted) {
                    setCharacterState(prev => ({ ...prev, isMoving: false }));
                    const gameName = MINIGAME_NAMES[isPopupTriggered] || 'mini-game';
                    setCompletedMinigamePopup({ isVisible: true, gameName });
                    setHasShownPopupForTrigger(isPopupTriggered);
                } else {
                    // Si no está completado, verificar si está desbloqueado
                    const { unlocked, message } = checkMinigameUnlocked(isPopupTriggered);
                    
                    if (!unlocked) {
                        setLockedMessage(message);
                        setHasShownPopupForTrigger(isPopupTriggered);
                    } else {
                        setCharacterState(prev => ({ ...prev, isMoving: false }));
                        const gameName = MINIGAME_NAMES[isPopupTriggered] || 'mini-game';
                        setMiniGamePopupState({ isVisible: true, targetRoute, gameName });
                        setHasShownPopupForTrigger(isPopupTriggered);
                    }
                }
            }
        }
        
        if (!isPopupTriggered && hasShownPopupForTrigger) {
            setHasShownPopupForTrigger(null);
        }
    }, [isPopupTriggered, miniGamePopupState, completedMinigamePopup, showLogoutPopup, hasShownPopupForTrigger, lockedMessage]);

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

    useEffect(() => {
        const triggeredNPC = checkNPCTrigger(
            characterState.mapX,
            characterState.mapY,
            SCALED_SPRITE_SIZE
        );

        setCurrentNPCTrigger(triggeredNPC);

        if (triggeredNPC && 
            triggeredNPC !== lastNPCTrigger && 
            !npcDialogue && 
            !miniGamePopupState && 
            !completedMinigamePopup && 
            !showLogoutPopup) {
            
            const npc = NPC_LIST.find(n => n.id === triggeredNPC);
            if (npc) {
                const randomDialogue = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
                setCharacterState(prev => ({ ...prev, isMoving: false }));
                
                setNpcDialogue({
                    npcName: npc.name,
                    dialogue: randomDialogue
                });
                setLastNPCTrigger(triggeredNPC);
            }
        }

        if (!triggeredNPC && lastNPCTrigger) {
            setLastNPCTrigger(null);
        }
    }, [characterState.mapX, characterState.mapY, lastNPCTrigger, npcDialogue, miniGamePopupState, completedMinigamePopup, showLogoutPopup]);

    // Verificar si completó todos los minijuegos al cargar
    useEffect(() => {
        if (!showIntro) {
            const allCompleted = checkAllMinigamesCompleted();
            const alreadySeen = hasSeenAllCompletedPopup();
            
            if (allCompleted && !alreadySeen) {
                console.log('🎉 Todos los minijuegos completados!');
                setShowAllCompletedPopup(true);
            }
        }
    }, [showIntro]);

    const isAnyPopupOpen = showIntro || showTutorial || showLogoutPopup || !!miniGamePopupState || !!completedMinigamePopup || showAllCompletedPopup || !!npcDialogue || !!lockedMessage;

    const moveCharacter = useCallback((dx: number, dy: number, direction: number) => {
        setCharacterState((prev) => {
            const newX = prev.mapX + dx;
            const newY = prev.mapY + dy;

            const HALF_SPRITE = SCALED_SPRITE_SIZE / 2;
            const limitedX = Math.max(HALF_SPRITE, Math.min(CUSTOM_MAX_X_POS - HALF_SPRITE, newX));
            const limitedY = Math.max(HALF_SPRITE, Math.min(CUSTOM_MAX_Y_POS - HALF_SPRITE, newY));

            const hasCollision = checkCollision(limitedX, limitedY, SCALED_SPRITE_SIZE, COLLISION_AREAS, DEBUG_MODE);

            let finalX = limitedX;
            let finalY = limitedY;

            if (hasCollision) {
                const tryX = checkCollision(limitedX, prev.mapY, SCALED_SPRITE_SIZE, COLLISION_AREAS, DEBUG_MODE);
                const tryY = checkCollision(prev.mapX, limitedY, SCALED_SPRITE_SIZE, COLLISION_AREAS, DEBUG_MODE);

                if (!tryX) {
                    finalY = prev.mapY;
                } else if (!tryY) {
                    finalX = prev.mapX;
                } else {
                    finalX = prev.mapX;
                    finalY = prev.mapY;
                }
            }

            return { ...prev, mapX: finalX, mapY: finalY, direction, isMoving: true };
        });
    }, []);

    const stopCharacter = useCallback(() => {
        setCharacterState((prev) => (prev.isMoving ? { ...prev, isMoving: false } : prev));
    }, []);

    useKeyboardMovement({
        enabled: !isAnyPopupOpen,
        speed: MOVEMENT_SPEED,
        onMove: moveCharacter,
        onStop: stopCharacter,
    });

    useEffect(() => {
        if (npcDialogue || miniGamePopupState || completedMinigamePopup || showAllCompletedPopup || showLogoutPopup || lockedMessage) {
            setCharacterState(prev => ({ ...prev, isMoving: false, frame: 0 }));
        }
    }, [npcDialogue, miniGamePopupState, completedMinigamePopup, showAllCompletedPopup, showLogoutPopup, lockedMessage]);

    // En pantallas más grandes que el mapa se amplía todo el mundo (mapa + personaje)
    // para que cubra la pantalla. Las coordenadas del juego no cambian.
    const worldZoom = Math.max(1, viewport.width / MAX_MAP_WIDTH, viewport.height / MAX_MAP_HEIGHT);
    const visibleWidth = viewport.width / worldZoom;
    const visibleHeight = viewport.height / worldZoom;

    const halfScreenW = visibleWidth / 2;
    const halfScreenH = visibleHeight / 2;

    const backgroundTranslateX = Math.max(
        Math.min(halfScreenW - characterState.mapX, 0),
        visibleWidth - MAX_MAP_WIDTH
    );
    const backgroundTranslateY = Math.max(
        Math.min(halfScreenH - characterState.mapY, 0),
        visibleHeight - MAX_MAP_HEIGHT
    );

    const handleConfirmMinigame = () => {
        if (miniGamePopupState) {
            setCharacterState(prev => ({
                ...prev,
                mapY: prev.mapY + 30, 
                isMoving: false
            }));

            const positionData = {
                mapX: characterState.mapX,
                mapY: characterState.mapY + 30, // Guardar la nueva posición
                direction: characterState.direction,
            };
            localStorage.setItem('worldCharacterPosition', JSON.stringify(positionData));
            
            setMiniGamePopupState(null);
            
            setTimeout(() => {
                navigate(miniGamePopupState.targetRoute);
            }, 100);
        }
    };

    const handleGoToRoom = () => {
        markAllCompletedPopupAsSeen();
        setShowAllCompletedPopup(false);
        navigate('/room');
    };

    if (showIntro) {
        return <LoadingScreen onAnimationEnd={() => setShowIntro(false)} />;
    }

    const nextGame = getOverallProgress().next;

    return (
        <div className="relative w-screen h-screen overflow-hidden" style={{ backgroundColor: '#4c965c' }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${visibleWidth}px`,
                    height: `${visibleHeight}px`,
                    transform: `scale(${worldZoom})`,
                    transformOrigin: '0 0',
                }}
            >
            <CollisionDebugger
                backgroundTranslateX={backgroundTranslateX}
                backgroundTranslateY={backgroundTranslateY}
            />

            <div
                style={{
                    position: 'absolute',
                    zIndex: 0,
                    border: '5px solid #ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 8px 0 0 #ff69b4',
                    overflow: 'hidden',
                    transform: `translate(${backgroundTranslateX}px, ${backgroundTranslateY}px)`,
                    width: `${MAX_MAP_WIDTH}px`,
                    height: `${MAX_MAP_HEIGHT}px`,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${BACKGROUND_URL})`,
                        backgroundSize: '100% 100%',
                        imageRendering: 'auto',
                    }}
                />
            </div>

            {/* Las guías se desplazan igual que el sprite visible del personaje (ver CHARACTER_VISUAL_OFFSET) */}
            <WorldGuides
                translateX={backgroundTranslateX + CHARACTER_VISUAL_OFFSET}
                translateY={backgroundTranslateY + CHARACTER_VISUAL_OFFSET}
                characterX={characterState.mapX}
                characterY={characterState.mapY}
                showArrow={!isAnyPopupOpen}
            />

            <Character
                x={characterState.mapX + backgroundTranslateX - SCALED_SPRITE_SIZE / 2}
                y={characterState.mapY + backgroundTranslateY - SCALED_SPRITE_SIZE / 2}
                style={{ zIndex: 1, position: 'absolute' }}
                direction={characterState.direction}
                frame={characterState.frame}
            />
            </div>

            <GameHud
                disabled={showLogoutPopup || !!miniGamePopupState || !!completedMinigamePopup || showAllCompletedPopup || showTutorial}
                onHelp={() => setShowTutorial(true)}
                onLogout={() => setShowLogoutPopup(true)}
            />

            {!isAnyPopupOpen && (
                nextGame ? (
                    <GoalBanner
                        text={<>Next: <b><Icon name="estrella" /> {nextGame.name}</b> in the {nextGame.houseEn}. Follow the yellow arrow <Icon name="flecha" /></>}
                        textEs={`Siguiente: ${nextGame.nameEs}, en la ${nextGame.houseEs}. Sigue la flecha amarilla y camina a la puerta que brilla.`}
                    />
                ) : (
                    <GoalBanner
                        text={<>All activities done! Go back to <b><Icon name="casa" /> My Room</b> to rest.</>}
                        textEs="¡Completaste todas las actividades! Regresa a tu casa (My Room) para descansar."
                    />
                )
            )}

            {DEBUG_MODE && (
                <div className="fixed bottom-4 left-4 p-2 text-xs font-bold rounded" style={{ zIndex: 10, backgroundColor: '#add8e6', color: '#333333', border: '2px solid #6495ed', boxShadow: '2px 2px 0px #6495ed' }}>
                    Pos: ({Math.round(characterState.mapX)}, {Math.round(characterState.mapY)})
                </div>
            )}

            {showTutorial && <Tutorial userName={getStoredUserName()} onClose={() => setShowTutorial(false)} />}
            {showLogoutPopup && <ConfirmationPopup onConfirm={() => { setShowLogoutPopup(false); navigate('/'); }} onCancel={() => setShowLogoutPopup(false)} />}
            {miniGamePopupState?.isVisible && <MiniGameConfirmationPopup minigameName={miniGamePopupState.gameName} onConfirm={handleConfirmMinigame} onCancel={() => setMiniGamePopupState(null)} />}
            {completedMinigamePopup?.isVisible && <CompletedMinigamePopup minigameName={completedMinigamePopup.gameName} onClose={() => setCompletedMinigamePopup(null)} />}
            {showAllCompletedPopup && <AllMinigamesCompletedPopup onGoToRoom={handleGoToRoom} />}
            {lockedMessage && <LockedMinigamePopup message={lockedMessage} onClose={() => setLockedMessage(null)} />}
            {npcDialogue && <NPCDialoguePopup npcName={npcDialogue.npcName} text={npcDialogue.dialogue.text} image={npcDialogue.dialogue.image} onClose={() => setNpcDialogue(null)} />}
        </div>
    );
};

export default WorldScreen;