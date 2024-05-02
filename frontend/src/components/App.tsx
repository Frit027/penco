import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

type Coordinate = {
    x: number,
    y: number,
};

export const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

    const drawLine = (coordinates: { startX: number, startY: number, endX: number, endY: number }) => {
        if (!canvasRef.current) {
            return;
        }

        const context = canvasRef.current.getContext('2d');
        if (!context) {
            return;
        }

        context.beginPath();
        context.moveTo(coordinates.startX, coordinates.startY);
        context.lineTo(coordinates.endX, coordinates.endY);
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
                startX: mousePosition.x,
                startY: mousePosition.y,
                endX: newMousePosition.x,
                endY: newMousePosition.y,
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

    console.log('render');
    return <canvas ref={canvasRef} width="600" height="600" style={{ backgroundColor: '#eee', border: '1px solid #ccc', margin: '10px' }} />;
};
