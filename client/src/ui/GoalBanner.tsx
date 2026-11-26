import React from 'react';
import Icon from './Icon';

// Indicación del siguiente paso, centrada arriba (hallazgo #05).
interface GoalBannerProps {
    text: React.ReactNode;
    textEs: string;
}

const GoalBanner: React.FC<GoalBannerProps> = ({ text, textEs }) => (
    <div className="tt-goal" role="status" aria-live="polite">
        <Icon name="objetivo" size="2.2rem" />
        <div>
            <p className="tt-goal__text">{text}</p>
            <p className="tt-goal__es">{textEs}</p>
        </div>
    </div>
);

export default GoalBanner;
