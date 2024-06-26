import { useState, useEffect, RefObject } from 'react';
import { socket } from '../../socket';
import { Figure } from '../../interfaces';
import { TMouseCoordinates, TSocketData } from '../interfaces';
import getCurrentScaledMousePosition from '../utils';
import { TCircle } from './interfaces';

/**
 * Hook for drawing a circle on the canvas
 * @param {RefObject<HTMLCanvasElement>} fakeCanvasRef - The intermediate canvas on which the figures are drawn first
 * @param {RefObject<HTMLCanvasElement>} originCanvasRef - The final canvas onto which the final figures are transferred
 * @param {Figure|null} figureType - The type of figure to determine whether to use a hook
 */
export const useDrawingCircle = (
    fakeCanvasRef: RefObject<HTMLCanvasElement>,
    originCanvasRef: RefObject<HTMLCanvasElement>,
    figureType: Figure | null,
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
        const fakeCanvas = fakeCanvasRef.current;
        if (!fakeCanvas) {
            return;
        }

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
     * Assembling data to draw a circle
     * @param {MouseEvent} e - Event when the mouse button is moved or raised
     * @returns {TCircle} Data for drawing a circle
     */
    const getCircleProperties = (e: MouseEvent): TCircle => {
        const { x, y } = mousePosition;
        const { x: currentX } = getCurrentScaledMousePosition(e);

        return { x, y, radius: Math.abs(currentX - x) };
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

        const circleProperties = getCircleProperties(e);

        socket.emit('draw:circle', { ...circleProperties, canvasId: originCanvasRef.current?.id });
        drawOnFakeCanvas(circleProperties);
    };

    /**
     * Handling a mouse up
     * @param {MouseEvent} e - Mouse move event
     */
    const handleMouseUp = (e: MouseEvent) => {
        const circleProperties = getCircleProperties(e);

        socket.emit('stop-drawing:circle', { ...circleProperties, canvasId: originCanvasRef.current?.id });
        drawOnOriginCanvas(circleProperties);

        setIsDraw(false);
    };

    /**
     * Subscribing to the socket draw event
     */
    useEffect(() => {
        socket.on('draw:circle', (data: TSocketData<TCircle>) => {
            if (originCanvasRef.current?.id !== data.canvasId) {
                return;
            }
            drawOnFakeCanvas(data);
        });

        socket.on('stop-drawing:circle', (data: TSocketData<TCircle>) => {
            if (originCanvasRef.current?.id !== data.canvasId) {
                return;
            }
            drawOnOriginCanvas(data);
        });

        return () => {
            socket.off('draw:circle');
            socket.off('stop-drawing:circle');
        };
    }, [fakeCanvasRef, originCanvasRef, figureType]);

    /**
     * Canvas subscription to the mouse down event
     */
    useEffect(() => {
        if (!fakeCanvasRef.current || figureType !== Figure.Circle) {
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
        if (!fakeCanvasRef.current || figureType !== Figure.Circle) {
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
        if (!fakeCanvasRef.current || figureType !== Figure.Circle) {
            return undefined;
        }

        const fakeCanvas = fakeCanvasRef.current;
        fakeCanvas.addEventListener('mouseup', handleMouseUp);

        return () => fakeCanvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);
};
