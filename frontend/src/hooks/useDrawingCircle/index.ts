import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { TMouseCoordinates } from '../interfaces';
import { TCircle } from './interfaces';

/**
 * Hook for drawing a circle on the canvas
 * @param {RefObject<HTMLCanvasElement>} fakeCanvasRef - The intermediate canvas on which the figures are drawn first
 * @param {RefObject<HTMLCanvasElement>} originCanvasRef - The final canvas onto which the final figures are transferred
 * @param {string} figureType - The type of figure to determine whether to use a hook
 */
export const useDrawingCircle = (
    fakeCanvasRef: RefObject<HTMLCanvasElement>,
    originCanvasRef: RefObject<HTMLCanvasElement>,
    figureType: string,
) => {
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<TMouseCoordinates>({ x: 0, y: 0 });

    /**
     * Drawing a circle on a fake canvas
     * @param {TCircle} circleProperties - Properties of the circle being drawn
     * @param {number} circleProperties.x - The horizontal coordinate of the circle's center
     * @param {number} circleProperties.y - The vertical coordinate of the circle's center
     * @param {number} circleProperties.radius - The circle's radius
     */
    const drawOnFakeCanvas = ({ x, y, radius }: TCircle) => {
        if (!fakeCanvasRef.current) {
            return;
        }

        const fakeCanvas = fakeCanvasRef.current;
        const fakeContext = fakeCanvas.getContext('2d');
        if (!fakeContext) {
            return;
        }

        fakeContext.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
        fakeContext.beginPath();
        fakeContext.arc(x, y, radius, 0, 2 * Math.PI);
        fakeContext.stroke();
    };

    /**
     * Drawing a circle on the original canvas
     * @param {TCircle} circleProperties - Properties of the circle being drawn
     * @param {number} circleProperties.x - The horizontal coordinate of the circle's center
     * @param {number} circleProperties.y - The vertical coordinate of the circle's center
     * @param {number} circleProperties.radius - The circle's radius
     */
    const drawOnOriginCanvas = ({ x, y, radius }: TCircle) => {
        const originContext = originCanvasRef.current?.getContext('2d');
        if (!originContext) {
            return;
        }

        originContext.beginPath();
        originContext.arc(x, y, radius, 0, 2 * Math.PI);
        originContext.stroke();
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
        const circleProperties = { x, y, radius: Math.abs(e.pageX - rect.left - x) };

        socket.emit('drawCircle', circleProperties);
        drawOnFakeCanvas(circleProperties);
    };

    /**
     * Handling a mouse up
     */
    const handleMouseUp = (e: MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const { x, y } = mousePosition;
        const circleProperties = { x, y, radius: Math.abs(e.pageX - rect.left - x) };

        socket.emit('drawCircleStop', circleProperties);
        drawOnOriginCanvas(circleProperties);

        setIsDraw(false);
    };

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('drawCircle', (data: TCircle) => drawOnFakeCanvas(data));
        socket.on('drawCircleStop', (data: TCircle) => drawOnOriginCanvas(data));

        return () => {
            socket.off('drawCircle');
            socket.off('drawCircleStop');
        };
    }, [fakeCanvasRef, originCanvasRef, figureType]);

    /**
     * Canvas subscription to the mouse down event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== 'circle') {
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
        if (!fakeCanvasRef.current || figureType !== 'circle') {
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
        if (!fakeCanvasRef.current || figureType !== 'circle') {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mouseup', handleMouseUp);

        return () => fakeCanvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
