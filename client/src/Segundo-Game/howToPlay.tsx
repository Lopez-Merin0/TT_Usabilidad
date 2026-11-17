import React from 'react';
import { commonSteps, ExampleCheckButton } from '../components/minigame/MinigameAssist';

// Ejemplo demostrativo antes de jugar Verb Workshop (#18). Usa una oración que
// no está en las preguntas reales para no dar la respuesta.
export const HOW_TO_PLAY = {
    title: 'How to play Verb Workshop',
    titleEs: 'Cómo jugar Taller de verbos',
    example: (
        <>
            <p className="tt-howto__prompt">Complete the sentence: <b style={{ color: '#2E6F40' }}>I ____ happy.</b></p>
            <div className="tt-howto__options">
                <span className="tt-howto__opt">is</span>
                <span className="tt-howto__opt is-picked">am</span>
                <span className="tt-howto__opt">are</span>
                <span className="tt-howto__opt">be</span>
            </div>
            <ExampleCheckButton />
            <p className="tt-howto__prompt" style={{ marginTop: '8px', fontSize: '0.95rem' }}>
                ✅ <b>I am happy.</b> <span className="tt-es">(Yo estoy feliz.)</span>
            </p>
        </>
    ),
    steps: commonSteps({
        icon: '📖',
        en: <>Read the sentence and find the missing word (<b>____</b>).</>,
        es: 'Lee la oración y encuentra la palabra que falta (____).',
    }),
};
