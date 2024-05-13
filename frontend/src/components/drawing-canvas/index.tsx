import React, { useContext, useRef } from 'react';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';

/**
 * Component for displaying a canvas
 */
export const DrawingCanvas = () => {
    const { figureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    return (
        <div>
            <canvas
                ref={originCanvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ position: 'fixed', top: 0, left: 0 }}
            />
            <canvas
                ref={fakeCanvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
        </div>
    );
};
