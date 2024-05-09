import React, { useState, useRef } from 'react';
import { useDrawingLine } from '../../hooks/useDrawingLine';
import { useDrawingRectangle } from '../../hooks/useDrawingRectangle';
import { useDrawingCircle } from '../../hooks/useDrawingCircle';
import { Figure } from '../../interfaces';

/**
 * Component for displaying a canvas
 */
export const Canvas = () => {
    const [figureType, setFigureType] = useState('');
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    const handleChangeFigureType = (selectedFigureType: Figure) => setFigureType(selectedFigureType);

    return (
        <div>
            <button type="button" onClick={() => handleChangeFigureType(Figure.Line)}>Line</button>
            <button type="button" onClick={() => handleChangeFigureType(Figure.Rectangle)}>Rect</button>
            <button type="button" onClick={() => handleChangeFigureType(Figure.Circle)}>Circle</button>
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
