import React from 'react';
import { Figure } from '../../interfaces';
import { TToolbarProps } from './interfaces';

/**
 * Component for displaying a toolbar
 */
export const Toolbar = ({ changeFigureType }: TToolbarProps) => (
    <div>
        <button type="button" onClick={() => changeFigureType(Figure.Line)}>Line</button>
        <button type="button" onClick={() => changeFigureType(Figure.Rectangle)}>Rect</button>
        <button type="button" onClick={() => changeFigureType(Figure.Circle)}>Circle</button>
    </div>
);
