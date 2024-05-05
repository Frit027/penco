import React, { useRef } from 'react';
import { useDrawingLine } from '../hooks/useDrawingLine';

/**
 * Component for displaying a canvas
 */
export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(canvasRef);

    return (
        <canvas
            ref={canvasRef}
            width="600"
            height="600"
            style={{ backgroundColor: '#eee', border: '1px solid #ccc', margin: '10px' }}
        />
    );
};
