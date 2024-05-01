import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export const App = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        socket.on('click', (data) => setCount(data.count));
    }, []);

    useEffect(() => {
        socket.emit('click', { count });
    }, [count]);

    const handleClick = () => setCount((prevCount) => prevCount + 1);

    return (
        <div>
            <button type="button" onClick={handleClick}>Click</button>
            <span>{count}</span>
        </div>
    );
};
