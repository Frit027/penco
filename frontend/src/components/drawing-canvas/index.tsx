import React, { useContext, useRef, useState, useEffect } from 'react';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';
import { classes } from './config';
import './styles.less';

/**
 * Component for displaying a canvas
 */
export const DrawingCanvas = () => {
    const { figureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);
    const [imageCanvas, setImageCanvas] = useState<HTMLImageElement | null>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    const saveContent = () => {
        if (!originCanvasRef.current) {
            return;
        }

        const img = new Image();
        img.src = originCanvasRef.current.toDataURL();
        setImageCanvas(img);
    };

    useEffect(() => {
        window.addEventListener('resize', saveContent);
        return () => window.removeEventListener('resize', saveContent);
    }, []);

    useEffect(() => {
        if (!imageCanvas) {
            return;
        }

        const originContext = originCanvasRef.current?.getContext('2d');
        originContext?.drawImage(imageCanvas, 0, 0);
    }, [imageCanvas]);

    return (
        <div>
            <canvas
                className={classes.component}
                ref={originCanvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                id="origin-canvas"
            />
            <canvas
                className={classes.component}
                ref={fakeCanvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </div>
    );
};
