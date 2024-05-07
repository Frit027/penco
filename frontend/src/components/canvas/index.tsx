import React, { useState, useRef } from 'react';
import { useDrawingLine } from '../../hooks/useDrawingLine';
import { useDrawingRectangle } from '../../hooks/useDrawingRectangle';

/**
 * Component for displaying a canvas
 */
export const Canvas = () => {
    const [figureType, setFigureType] = useState('');
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);

    const handleChangeFigureType = (selectedFigureType: string) => setFigureType(selectedFigureType);

    return (
        <div>
            <button type="button" onClick={() => handleChangeFigureType('line')}>Line</button>
            <button type="button" onClick={() => handleChangeFigureType('rect')}>Rect</button>
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
