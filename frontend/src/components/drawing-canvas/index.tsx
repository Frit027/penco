import React, { useContext, useRef, useState, useEffect } from 'react';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';

/**
 * Component for displaying a canvas
 */
export const DrawingCanvas = () => {
    const { figureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);
    const [content, setContent] = useState<ImageData | null>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    const saveContent = () => {
        const originCanvas = originCanvasRef.current;
        if (!originCanvas) {
            return;
        }

        const originContext = originCanvas.getContext('2d');
        if (!originContext) {
            return;
        }

        setContent(originContext.getImageData(0, 0, originCanvas.width, originCanvas.height));
    };

    useEffect(() => {
        window.addEventListener('resize', saveContent);
        return () => window.removeEventListener('resize', saveContent);
    }, []);

    useEffect(() => {
        const originCanvas = originCanvasRef.current;
        const originContext = originCanvas?.getContext('2d');

        if (!content) {
            return;
        }

        originContext?.putImageData(content, 0, 0);
    }, [content]);

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
                style={{ position: 'fixed', top: 0, left: 0 }}
            />
        </div>
    );
};
