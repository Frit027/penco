import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { TMouseCoordinates } from '../interfaces';
import { TRectangle } from './interfaces';

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
     * Drawing a rectangle on a fake canvas
     * @param {TRectangle} rectangleProperties - Properties of the rectangle being drawn
     * @param {number} rectangleProperties.x - The x-axis coordinate of the rectangle's starting point
     * @param {number} rectangleProperties.y - The y-axis coordinate of the rectangle's starting point
     * @param {number} rectangleProperties.width - The rectangle's width
     * @param {number} rectangleProperties.height - The rectangle's height
     */
    const drawOnFakeCanvas = ({ x, y, width, height }: TRectangle) => {
        if (!fakeCanvasRef.current) {
            return;
        }

        const fakeCanvas = fakeCanvasRef.current;
        const fakeContext = fakeCanvas.getContext('2d');
        if (!fakeContext) {
            return;
        }

        fakeContext.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
        fakeContext.strokeRect(x, y, width, height);
    };

    /**
     * Drawing a rectangle on the original canvas
     * @param {TRectangle} rectangleProperties - Properties of the rectangle being drawn
     * @param {number} rectangleProperties.x - The x-axis coordinate of the rectangle's starting point
     * @param {number} rectangleProperties.y - The y-axis coordinate of the rectangle's starting point
     * @param {number} rectangleProperties.width - The rectangle's width
     * @param {number} rectangleProperties.height - The rectangle's height
     */
    const drawOnOriginCanvas = ({ x, y, width, height }: TRectangle) => {
        const originContext = originCanvasRef.current?.getContext('2d');
        if (!originContext) {
            return;
        }
        originContext.strokeRect(x, y, width, height);
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
        if (!isDraw) {
            return;
        }

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const { x, y } = mousePosition;
        const rectangleProperties = {
            x,
            y,
            width: e.pageX - rect.left - x,
            height: e.pageY - rect.top - y,
        };

        socket.emit('draw:rectangle', rectangleProperties);
        drawOnFakeCanvas(rectangleProperties);
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
        const rectangleProperties = {
            x,
            y,
            width: e.pageX - rect.left - x,
            height: e.pageY - rect.top - y,
        };

        socket.emit('stop-drawing:rectangle', rectangleProperties);
        drawOnOriginCanvas(rectangleProperties);

        setIsDraw(false);
    };

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('draw:rectangle', (data: TRectangle) => drawOnFakeCanvas(data));
        socket.on('stop-drawing:rectangle', (data: TRectangle) => drawOnOriginCanvas(data));

        return () => {
            socket.off('draw:rectangle');
            socket.off('stop-drawing:rectangle');
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
