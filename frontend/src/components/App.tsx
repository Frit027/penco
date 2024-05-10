import React, { useState } from 'react';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Figure } from '../interfaces';

export const App = () => {
    const [figureType, setFigureType] = useState<Figure | null>(null);

    /**
     * Handler for click to change a figure type to be drawn
     * @param {Figure} selectedFigureType - Type of figure to be drawn
     */
    const handleChangeFigureType = (selectedFigureType: Figure) => setFigureType(selectedFigureType);

    return (
        <>
            <Toolbar changeFigureType={handleChangeFigureType} />
            <Canvas figureType={figureType} />
        </>
    );
};
