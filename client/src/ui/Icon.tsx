/// <reference types="vite/client" />
import React from 'react';

// Íconos propios de Talkie Town (v3): dibujos originales en estilo "cozy"
// (contorno café, franja de sombra y brillo) que reemplazan a los emojis,
// que se veían distinto en cada sistema operativo. Los SVG están en assets/icons.

const files = import.meta.glob('../assets/icons/*.svg', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

const URLS: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
    URLS[path.slice(path.lastIndexOf('/') + 1, -'.svg'.length)] = url;
}

export type IconName =
    | 'audifonos' | 'ayuda' | 'candado' | 'casa' | 'correcto' | 'dialogo' | 'dormir'
    | 'error' | 'estrella' | 'fiesta' | 'flecha' | 'idioma' | 'libro' | 'mapa'
    | 'musica' | 'objetivo' | 'pista' | 'salir' | 'saludo' | 'senalar' | 'silencio'
    | 'sonido' | 'tortuga' | 'trofeo';

interface IconProps {
    name: IconName;
    /** Tamaño CSS; por defecto 1.25em para ir junto al texto. */
    size?: number | string;
    /** Texto alternativo. Sin él, el ícono es decorativo y se oculta a lectores de pantalla. */
    label?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, size = '1.25em', label, className, style }) => (
    <img
        src={URLS[name]}
        alt={label ?? ''}
        aria-hidden={label ? undefined : true}
        draggable={false}
        className={`tt-icon${className ? ` ${className}` : ''}`}
        style={{ width: size, height: size, ...style }}
    />
);

export default Icon;
