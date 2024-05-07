import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { TMouseCoordinates, TRectangle } from './interfaces';

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
     * Rectangle drawing
     * @param {TPathCoordinates} rectangleProperties - Properties of the rectangle being drawn
     */
    const draw = (rectangleProperties: TRectangle) => {
        if (!fakeCanvasRef.current) {
            return;
        }

        const fakeCanvas = fakeCanvasRef.current;
        const fakeContext = fakeCanvas.getContext('2d');
        if (!fakeContext) {
            return;
        }

        const {
            x, y, width, height,
        } = rectangleProperties;

        fakeContext.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
        fakeContext.strokeRect(x, y, width, height);
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
            const { x, y } = mousePosition;

            const rectangleProperties = {
                x,
                y,
                width: e.pageX - rect.left - x,
                height: e.pageY - rect.top - y,
            };

            socket.emit('drawRect', rectangleProperties);
            draw(rectangleProperties);
        }
    };

    /**
     * Handling a mouse up
     */
    const handleMouseUp = (e: MouseEvent) => {
        const originContext = originCanvasRef.current?.getContext('2d');
        if (!originContext) {
            return;
        }

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const { x, y } = mousePosition;
        const width = e.pageX - rect.left - x;
        const height = e.pageY - rect.top - y;

        socket.emit('drawRectStop', {
            x, y, width, height,
        });
        originContext.strokeRect(x, y, width, height);

        setIsDraw(false);
    };

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('drawRect', (data: TRectangle) => draw(data));

        socket.on('drawRectStop', (data: TRectangle) => {
            const originContext = originCanvasRef.current?.getContext('2d');
            if (!originContext) {
                return;
            }
            originContext.strokeRect(data.x, data.y, data.width, data.height);
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

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mousedown', handleMouseDown);

        return () => fakeCanvas.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    /**
     * Canvas subscription to the mouse move event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== 'rect') {
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
        if (!fakeCanvasRef.current || figureType !== 'rect') {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mouseup', handleMouseUp);

        return () => fakeCanvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
