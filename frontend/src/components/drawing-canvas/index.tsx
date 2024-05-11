import React, { useRef } from 'react';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';
import { TCanvasProps } from './interfaces';

/**
 * Component for displaying a canvas
 */
export const DrawingCanvas = ({ figureType }: TCanvasProps) => {
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    return (
        <div>
            <canvas
                ref={originCanvasRef}
                width="600"
                height="600"
                style={{ position: 'absolute', border: '1px solid #ccc', margin: '10px' }}
            />
            <canvas
                ref={fakeCanvasRef}
                width="600"
                height="600"
                style={{ position: 'absolute', border: '1px solid #ccc', margin: '10px' }}
            />
        </div>
    );
};
