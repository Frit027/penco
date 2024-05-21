import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { Figure } from '../../interfaces';
import { TMouseCoordinates, TSocketData } from '../interfaces';
import getCurrentScaledMousePosition from '../utils';
import { TPathCoordinates } from './interfaces';

/**
 * Hook for drawing a line on the canvas
 * @param {RefObject<HTMLCanvasElement>} fakeCanvasRef - The intermediate canvas on which the figures are drawn first
 * @param {RefObject<HTMLCanvasElement>} originCanvasRef - The final canvas onto which the final figures are transferred
 * @param {Figure|null} figureType - The type of figure to determine whether to use a hook
 */
export const useDrawingLine = (
    fakeCanvasRef: RefObject<HTMLCanvasElement>,
    originCanvasRef: RefObject<HTMLCanvasElement>,
    figureType: Figure | null,
) => {
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<TMouseCoordinates>({ x: 0, y: 0 });

    /**
     * Line drawing
     * @param {TPathCoordinates} pathCoordinates - Coordinates of the start and end points of the line
     * @param {number} pathCoordinates.x1 - The horizontal coordinate to be moved to
     * @param {number} pathCoordinates.y1 - The vertical coordinate to be moved to
     * @param {number} pathCoordinates.x2 - The x-axis coordinate of the line's end point
     * @param {number} pathCoordinates.y2 - The y-axis coordinate of the line's end point
     */
    const draw = ({ x1, y1, x2, y2 }: TPathCoordinates) => {
        const fakeCanvas = fakeCanvasRef.current;
        if (!fakeCanvas) {
            return;
        }

        const fakeContext = fakeCanvas.getContext('2d');
        if (!fakeContext) {
            return;
        }

        fakeContext.beginPath();
        fakeContext.moveTo(x1, y1);
        fakeContext.lineTo(x2, y2);
        fakeContext.closePath();
        fakeContext.stroke();

        const originContext = originCanvasRef.current?.getContext('2d');
        if (!originContext) {
            return;
        }
        originContext.drawImage(fakeCanvas, 0, 0);
    };

    /**
     * Handling a mouse down
     * @param {MouseEvent} e - Mouse click event
     */
    const handleMouseDown = (e: MouseEvent) => {
        setIsDraw(true);
        setMousePosition(getCurrentScaledMousePosition(e));
    };

    /**
     * Handling a mouse move
     * @param {MouseEvent} e - Mouse move event
     */
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraw) {
            return;
        }

        const newMousePosition = getCurrentScaledMousePosition(e);

        const coordinates = {
            x1: mousePosition.x,
            y1: mousePosition.y,
            x2: newMousePosition.x,
            y2: newMousePosition.y,
        };

        socket.emit('draw:line', { ...coordinates, canvasId: originCanvasRef.current?.id });
        draw(coordinates);

        setMousePosition({
            x: newMousePosition.x,
            y: newMousePosition.y,
        });
    };

    /**
     * Handling a mouse up
     */
    const handleMouseUp = () => setIsDraw(false);

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('draw:line', (data: TSocketData<TPathCoordinates>) => {
            if (originCanvasRef.current?.id !== data.canvasId) {
                return;
            }
            draw(data);
        });

        return () => {
            socket.off('draw:line');
        };
    }, [fakeCanvasRef, originCanvasRef, figureType]);

    /**
     * Canvas subscription to the mouse down event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== Figure.Line) {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mousedown', handleMouseDown);

        return () => fakeCanvas.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    /**
     * Canvas subscription to the mouse move event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== Figure.Line) {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mousemove', handleMouseMove);

        return () => fakeCanvas.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    /**
     * Canvas subscription to the mouse up event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== Figure.Line) {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mouseup', handleMouseUp);

        return () => fakeCanvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
