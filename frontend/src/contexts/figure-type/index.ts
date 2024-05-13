import React, { createContext } from 'react';
import { Figure } from '../../interfaces';

export type TFigureTypeContext = {
    figureType: Figure | null,
    setFigureType: React.Dispatch<React.SetStateAction<Figure | null>>,
};

export const FigureTypeContext = createContext<TFigureTypeContext | null>(null);
