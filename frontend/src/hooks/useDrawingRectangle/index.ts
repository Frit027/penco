import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { TMouseCoordinates, TPathCoordinates } from '../useDrawingLine/interfaces';

/**
 * Hook for drawing a rectangle on the canvas
 * @param {RefObject<HTMLCanvasElement>} fakeCanvasRef - The intermediate canvas on which the figures are drawn first
 * @param {RefObject<HTMLCanvasElement>} originCanvasRef - The final canvas onto which the final figures are transferred
 * @param {string} figureType - The type of figure to determine whether to use a hook
 */
export const useDrawingRectangle = (
    fakeCanvasRef: RefObject<HTMLCanvasElement>,
    originCanvasRef: RefObject<HTMLCanvasElement>,
    figureType: string,
) => {
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<TMouseCoordinates>({ x: 0, y: 0 });

    /**
     * Line drawing
     * @param {TPathCoordinates} pathCoordinates - Coordinates of the start and end points of the line
     */
    const draw = (pathCoordinates: TPathCoordinates) => {
        if (!fakeCanvasRef.current) {
            return;
        }

        const fakeCanvas = fakeCanvasRef.current;
        const context = fakeCanvas.getContext('2d');
        if (!context) {
            return;
        }

        const {
            x1, y1, x2, y2,
        } = pathCoordinates;

        context.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
        context.strokeRect(x1, y1, x2 - x1, y2 - y1);
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

            const coordinates = {
                x1: mousePosition.x,
                y1: mousePosition.y,
                x2: e.pageX - rect.left,
                y2: e.pageY - rect.top,
            };

            socket.emit('drawRect', coordinates);
            draw(coordinates);
        }
    };

    /**
     * Handling a mouse up
     */
    const handleMouseUp = (e: MouseEvent) => {
        const overlayContext = originCanvasRef.current?.getContext('2d');
        if (!overlayContext) {
            return;
        }

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const { x, y } = mousePosition;
        const width = e.pageX - rect.left - x;
        const height = e.pageY - rect.top - y;

        socket.emit('drawRectStop', { x1: x, y1: y, x2: width, y2: height });
        console.log({ x1: x, y1: y, x2: width, y2: height });
        overlayContext.strokeRect(x, y, width, height);

        setIsDraw(false);
    };

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('drawRect', (data) => {
            console.log('rect');
            draw(data);
        });

        socket.on('drawRectStop', (data) => {
            console.log('stop');
            const overlayContext = originCanvasRef.current?.getContext('2d');
            if (!overlayContext) {
                return;
            }
            overlayContext.strokeRect(data.x1, data.y1, data.x2, data.y2);
        });

        return () => {
            socket.off('drawRect');
            socket.off('drawRectStop');
        };
    }, [fakeCanvasRef, originCanvasRef, figureType]);

    /**
     * Canvas subscription to the mouse down event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== 'rect') {
            return undefined;
        }

        const canvas = fakeCanvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);

        return () => canvas.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    /**
     * Canvas subscription to the mouse move event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== 'rect') {
            return undefined;
        }

        const canvas = fakeCanvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    /**
     * Canvas subscription to the mouse up event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== 'rect') {
            return undefined;
        }

        const canvas = fakeCanvasRef.current;
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => canvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
