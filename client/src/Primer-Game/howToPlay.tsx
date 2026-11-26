import React from 'react';
import { commonSteps, ExampleCheckButton } from '../components/minigame/MinigameAssist';
import Icon from '../ui/Icon';
import manzana from '../assets/Primer-Game/manzana.png';
import llave from '../assets/Primer-Game/llave.png';
import lapiz from '../assets/Primer-Game/lapiz.png';
import taza from '../assets/Primer-Game/taza.png';

// Ejemplo demostrativo antes de jugar Word Hunt (#18). Usa una palabra que no
// está en las preguntas reales para no dar la respuesta.
export const HOW_TO_PLAY = {
    title: 'How to play Word Hunt',
    titleEs: 'Cómo jugar Cacería de palabras',
    example: (
        <>
            <p className="tt-howto__prompt">Find the treasure: <b style={{ color: '#2E6F40' }}>Key</b></p>
            <div className="tt-howto__options">
                <span className="tt-howto__opt"><img src={manzana} alt="apple" /></span>
                <span className="tt-howto__opt is-picked"><img src={llave} alt="key (selected)" /></span>
                <span className="tt-howto__opt"><img src={lapiz} alt="pencil" /></span>
                <span className="tt-howto__opt"><img src={taza} alt="cup" /></span>
            </div>
            <ExampleCheckButton />
        </>
    ),
    steps: commonSteps({
        icon: <Icon name="libro" size={28} />,
        en: <>Read the English word at the bottom of the screen.</>,
        es: 'Lee la palabra en inglés que aparece abajo.',
    }),
};
