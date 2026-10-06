import { useEffect, useState } from 'react';

const TRIGGER_AREAS = {
    FirstMinigame: {
        xMin: 211,
        xMax: 246,
        yMin: 500,
        yMax: 535,
    },
    SecondMinigame: { 
        xMin: 718,
        xMax: 750, 
        yMin: 140,
        yMax: 170,
    },
    ThirdMinigame: { 
        xMin: 1159, 
        xMax: 1187, 
        yMin: 635,
        yMax: 670,
    },
    RoomMinigame: {  // Área para ir al cuarto: justo frente a la puerta de la casa azul
        xMin: 214,
        xMax: 250,
        yMin: 210,
        yMax: 235,
    },
};

// Dónde aparece el personaje en el mundo al salir del cuarto: en el caminito
// frente a la casa azul, debajo de la zona para entrar al cuarto
export const WORLD_SPAWN_FROM_ROOM = { mapX: 232, mapY: 250, direction: 1 };

interface UsePopupTriggerProps {
    mapX: number;
    mapY: number;
}

export const usePopupTrigger = ({ mapX, mapY }: UsePopupTriggerProps): string | null => {
    const [activeTrigger, setActiveTrigger] = useState<string | null>(null);

    useEffect(() => {
        let activatedKey: string | null = null;
        
        const checkArea = (area: typeof TRIGGER_AREAS['FirstMinigame']) => {
            const isInside = (
                mapX >= area.xMin &&
                mapX <= area.xMax &&
                mapY >= area.yMin &&
                mapY <= area.yMax
            );
            
            return isInside;
        };

        for (const [key, area] of Object.entries(TRIGGER_AREAS)) {
            if (checkArea(area)) {
                activatedKey = key;
                console.log('🎮 Trigger activado:', key, { mapX, mapY, area });
                break; 
            }
        }
        
        setActiveTrigger(activatedKey);

    }, [mapX, mapY]);

    return activeTrigger;
};