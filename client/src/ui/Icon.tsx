/// <reference types="vite/client" />
import React from 'react';

// Íconos de Talkie Town (v3) que reemplazan a los emojis, que se veían distinto
// en cada sistema operativo. Están en assets/icons:
// - PNG: glifos del "Garden cozy icons pack" de mandinhart (licencia de uso
//   personal y comercial), recortados con Iconos_v3/importar_garden.py.
// - SVG: glifos propios en el mismo estilo para lo que el paquete no trae
//   (Iconos_v3/glifos_ciruela.py) y la flecha guía amarilla.

// Cada ícono es un .svg o un .png con el mismo nombre (no los dos).
const files = import.meta.glob('../assets/icons/*.{svg,png}', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

const URLS: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
    const file = path.slice(path.lastIndexOf('/') + 1);
    URLS[file.slice(0, file.lastIndexOf('.'))] = url;
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
        data-icon={name}
        className={`tt-icon${className ? ` ${className}` : ''}`}
        style={{ width: size, height: size, ...style }}
    />
);

export default Icon;
