import React from 'react';
import { commonSteps, ExampleCheckButton } from '../components/minigame/MinigameAssist';
import Icon from '../ui/Icon';

// Ejemplo demostrativo antes de jugar Sweet Sounds (#18). Usa una frase que no
// está en las preguntas reales para no dar la respuesta.
export const HOW_TO_PLAY = {
    title: 'How to play Sweet Sounds',
    titleEs: 'Cómo jugar Dulces sonidos',
    example: (
        <>
            <p className="tt-howto__prompt">
                <span className="tt-howto__opt" style={{ marginRight: '8px', gap: '6px' }}><Icon name="sonido" /> Play</span>
                You hear: <i>"Good morning!"</i>
            </p>
            <div className="tt-howto__options">
                <span className="tt-howto__opt">Good night!</span>
                <span className="tt-howto__opt is-picked">Good morning!</span>
                <span className="tt-howto__opt">Good job!</span>
            </div>
            <ExampleCheckButton />
        </>
    ),
    steps: commonSteps({
        icon: <Icon name="audifonos" size={28} />,
        en: <>Press <b><Icon name="sonido" /> Play</b> to listen. You can listen again as many times as you want, or press <b><Icon name="tortuga" /> Slow</b> to hear it slower. Change the voice volume with the slider.</>,
        es: 'Presiona Play para escuchar. Puedes repetirlo las veces que quieras o presionar Slow para oírlo más lento. Cambia el volumen de la voz con la barra.',
    }),
};
