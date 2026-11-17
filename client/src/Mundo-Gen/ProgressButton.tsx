import React, { useState } from 'react';
import ProgressMap from '../components/ProgressMap';
import { getOverallProgress } from '../ui/gameProgress';

interface ProgressButtonProps {
    disabled?: boolean;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ disabled = false }) => {
    const [showProgressMap, setShowProgressMap] = useState(false);
    const { percent } = getOverallProgress();

    return (
        <>
            <button
                type="button"
                onClick={() => setShowProgressMap(true)}
                className="tt-hud__btn tt-hud__btn--progress"
                disabled={disabled}
                title="See your progress / Ver tu progreso"
            >
                <span>PROGRESS</span>
                <span className="tt-hud__meter" aria-hidden="true">
                    <span className="tt-hud__meter-fill" style={{ width: `${percent}%` }} />
                </span>
                <span>{percent}%</span>
            </button>

            {showProgressMap && <ProgressMap onClose={() => setShowProgressMap(false)} />}
        </>
    );
};

export default ProgressButton;
