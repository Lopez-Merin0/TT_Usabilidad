import React from 'react';

interface AllMinigamesCompletedPopupProps {
    onGoToRoom: () => void;
}

const AllMinigamesCompletedPopup: React.FC<AllMinigamesCompletedPopupProps> = ({ onGoToRoom }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="kawaii-popup p-8 rounded-lg shadow-lg text-center"
            style={{
                backgroundColor: '#fefefe',
                border: '5px solid #FFD700',
                boxShadow: '0 8px 0 0 #FFA500',
                maxWidth: '500px',
            }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#333333' }}>
                Congratulations!
            </h2>
            <p className="text-lg mb-4" style={{ color: '#666666', lineHeight: '1.6' }}>
                You have successfully completed <strong>all three mini-games</strong>.
            </p>
            <p className="text-base mb-6" style={{ color: '#666666', lineHeight: '1.6' }}>
                It is time to go home, rest, and start a new day full of adventures. 🏠💤
            </p>
            <button
                onClick={onGoToRoom}
                className="kawaii-button py-3 px-8 font-bold text-lg"
                style={{
                    backgroundColor: '#FFD700',
                    color: '#333333',
                    border: '4px solid #FFA500',
                    boxShadow: '5px 5px 0px #FFA500',
                }}
            >
                Go Home
            </button>
        </div>
    </div>
);

export default AllMinigamesCompletedPopup;
