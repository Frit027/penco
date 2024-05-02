import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

type TMouseCoordinates = {
    x: number,
    y: number,
};

type TPathCoordinates = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
};

export const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<TMouseCoordinates>({ x: 0, y: 0 });

    /**
     * Line drawing
     * @param { TPathCoordinates } pathCoordinates - Coordinates of the start and end points of the line
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

    const handleMouseDown = (e: MouseEvent) => {
        setIsDraw(true);

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setMousePosition({
            x: e.pageX - rect.left,
            y: e.pageY - rect.top,
        });
    };

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

    const handleMouseUp = () => setIsDraw(false);

    useEffect(() => {
        socket.on('draw', (data) => drawLine(data));
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);

        return () => canvas.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    useEffect(() => {
        if (!canvasRef.current) {
            return undefined;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => canvas.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);

    return (
        <canvas
            ref={canvasRef}
            width="600"
            height="600"
            style={{ backgroundColor: '#eee', border: '1px solid #ccc', margin: '10px' }}
        />
    );
};
