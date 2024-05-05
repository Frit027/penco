import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../../socket';
import { TMouseCoordinates, TPathCoordinates } from './interfaces';

/**
 * Hook for drawing a line on the canvas
 * @param {RefObject<HTMLCanvasElement>} canvasRef - Canvas object reference
 */
export const useDrawingLine = (canvasRef: RefObject<HTMLCanvasElement>) => {
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<TMouseCoordinates>({ x: 0, y: 0 });

    /**
     * Line drawing
     * @param {TPathCoordinates} pathCoordinates - Coordinates of the start and end points of the line
     */
    const drawLine = (pathCoordinates: TPathCoordinates) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) {
            return;
        }

        const {
            x1, y1, x2, y2,
        } = pathCoordinates;

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
    };

    /**
     * Handling a mouse down
     * @param {MouseEvent} e - Mouse click event
     */
    const handleMouseDown = (e: MouseEvent) => {
        setIsDraw(true);

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setMousePosition({
            x: e.pageX - rect.left,
            y: e.pageY - rect.top,
        });
    };

    /**
     * Handling a mouse move
     * @param {MouseEvent} e - Mouse click event
     */
    const handleMouseMove = (e: MouseEvent) => {
        if (isDraw) {
            const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();

            const newMousePosition = {
                x: e.pageX - rect.left,
                y: e.pageY - rect.top,
            };

            const coordinates = {
                x1: mousePosition.x,
                y1: mousePosition.y,
                x2: newMousePosition.x,
                y2: newMousePosition.y,
            };

            socket.emit('draw', coordinates);
            drawLine(coordinates);

            setMousePosition({
                x: newMousePosition.x,
                y: newMousePosition.y,
            });
        }
    };

    /**
     * Handling a mouse up
     */
    const handleMouseUp = () => setIsDraw(false);

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('draw', (data) => drawLine(data));

        return () => {
            socket.off('draw');
        };
    }, [canvasRef]);

    /**
     * Canvas subscription to the mouse down event
     */
    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);

        return () => canvas.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    /**
     * Canvas subscription to the mouse move event
     */
    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    /**
     * Canvas subscription to the mouse up event
     */
    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => canvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
