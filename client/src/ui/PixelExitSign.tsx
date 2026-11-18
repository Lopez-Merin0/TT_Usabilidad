import React from 'react';

// Indicador de la salida del cuarto (#13): "EXIT" en pixel art fijo, una flecha
// que rebota a saltitos hacia la puerta y "SALIDA" pequeño debajo.
// Todo se dibuja como SVG con píxeles cuadrados; la animación está en tt.css
// (.tt-exit-sign__arrow / __shadow) y se mantiene aunque el sistema pida
// reducir movimiento, para que la salida siempre se note.

const PIXEL = 4;        // tamaño de cada pixel de EXIT y la flecha
const PIXEL_SMALL = 2;  // tamaño de cada pixel de SALIDA

// Paleta café: contorno, luz, relleno y sombra
const COLORS = { o: '#4A2A14', h: '#FFD98A', f: '#F2A93B', s: '#C47A1E' } as const;

const ARROW = [
    '..ooooo..',
    '..ohfso..',
    '..ohfso..',
    '..ohfso..',
    '..ohfso..',
    'ooohfsooo',
    'ohhhffsso',
    '.ohhffso.',
    '..ohfso..',
    '...ofo...',
    '....o....',
];

// Letras de 5x7
const GLYPHS: Record<string, string[]> = {
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
    I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
};

type Rect = { x: number; y: number; fill: string };

// Devuelve los píxeles de una palabra con contorno de 1 pixel alrededor.
// Relleno por filas: 0-1 luz, 2-4 relleno, 5-6 sombra.
function wordRects(word: string): { rects: Rect[]; width: number; height: number } {
    const lit: [number, number][] = [];
    [...word].forEach((ch, i) => {
        GLYPHS[ch].forEach((row, y) => {
            [...row].forEach((bit, x) => {
                if (bit === '1') lit.push([i * 6 + x + 1, y + 1]);
            });
        });
    });

    const outline = new Set<string>();
    lit.forEach(([x, y]) => {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) outline.add(`${x + dx},${y + dy}`);
        }
    });

    const rects: Rect[] = [...outline].map((key) => {
        const [x, y] = key.split(',').map(Number);
        return { x, y, fill: COLORS.o };
    });
    lit.forEach(([x, y]) => {
        const row = y - 1;
        rects.push({ x, y, fill: row < 2 ? COLORS.h : row < 5 ? COLORS.f : COLORS.s });
    });

    return { rects, width: word.length * 6 - 1 + 2, height: 9 };
}

function arrowRects(): Rect[] {
    const rects: Rect[] = [];
    ARROW.forEach((row, y) => {
        [...row].forEach((c, x) => {
            if (c !== '.') rects.push({ x, y, fill: COLORS[c as keyof typeof COLORS] });
        });
    });
    return rects;
}

const PixelArt: React.FC<{ rects: Rect[]; width: number; height: number; pixel: number; className?: string }> = ({
    rects, width, height, pixel, className,
}) => (
    <svg
        className={className}
        width={width * pixel}
        height={height * pixel}
        viewBox={`0 0 ${width} ${height}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
    >
        {rects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={1} height={1} fill={r.fill} />
        ))}
    </svg>
);

const EXIT = wordRects('EXIT');
const SALIDA = wordRects('SALIDA');
const ARROW_RECTS = arrowRects();

const PixelExitSign: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <div className="tt-exit-sign" style={style} role="img" aria-label="EXIT / Salida">
        <PixelArt {...EXIT} pixel={PIXEL} />
        <div className="tt-exit-sign__hop" style={{ paddingTop: 2 * PIXEL + 12 }}>
            <PixelArt className="tt-exit-sign__arrow" rects={ARROW_RECTS} width={9} height={11} pixel={PIXEL} />
            <div className="tt-exit-sign__shadow" style={{ width: 9 * PIXEL, height: 2 * PIXEL }} />
        </div>
        <PixelArt {...SALIDA} pixel={PIXEL_SMALL} />
    </div>
);

export default PixelExitSign;
