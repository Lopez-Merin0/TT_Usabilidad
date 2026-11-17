import React from 'react';

// Recuadro de aviso general (arriba del formulario)
export const AuthMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`auth-message auth-message--${message.type}`}
        >
            <p className="auth-message__en">{message.en}</p>
            <p className="auth-message__es">{message.es}</p>
        </div>
    );
};

// Error debajo de un campo del formulario
export const FieldError = ({ error }) => {
    if (!error) return null;

    return (
        <div className="auth-field-error">
            <p className="auth-message__en">{error.en}</p>
            <p className="auth-message__es">{error.es}</p>
        </div>
    );
};

// Restricción de un campo, visible antes de enviar (hallazgo #11).
// state: 'neutral' (aún no escribe), 'ok' (cumple) o 'error' (no cumple)
export const FieldRule = ({ id, state = 'neutral', en, es }) => {
    const icon = state === 'ok' ? '✓' : state === 'error' ? '✗' : '•';
    return (
        <p id={id} className={`auth-rule auth-rule--${state}`}>
            <span className="auth-rule__icon" aria-hidden="true">{icon}</span>
            <span>
                {en} <span className="auth-rule__es">{es}</span>
            </span>
        </p>
    );
};
