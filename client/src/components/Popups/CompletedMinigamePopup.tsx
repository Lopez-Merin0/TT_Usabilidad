import React from 'react';

interface CompletedMinigamePopupProps {
    minigameName: string;
    onClose: () => void;
}

const CompletedMinigamePopup: React.FC<CompletedMinigamePopupProps> = ({ minigameName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="kawaii-popup p-6 rounded-lg shadow-lg text-center"
            style={{
                backgroundColor: '#fefefe',
                border: '5px solid #90EE90',
                boxShadow: '0 8px 0 0 #32CD32',
                maxWidth: '400px',
            }}>
            <p className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
                Congratulations!
            </p>
            <p className="text-base mb-4" style={{ color: '#666666' }}>
                You have completed <strong>{minigameName}</strong> and all its activities.
            </p>
            <button
                onClick={onClose}
                className="kawaii-button py-2 px-6 font-bold"
                style={{
                    backgroundColor: '#90EE90',
                    color: '#333333',
                    border: '3px solid #32CD32',
                }}
            >
                    Accept
            </button>
        </div>
    </div>
);

export default CompletedMinigamePopup;
