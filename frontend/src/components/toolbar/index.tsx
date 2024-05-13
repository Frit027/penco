import React, { useContext } from 'react';
import { Figure } from '../../interfaces';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { FileUploader } from '../file-uploader';

/**
 * Component for displaying a toolbar
 */
export const Toolbar = () => {
    const { setFigureType } = useContext(FigureTypeContext) as TFigureTypeContext;

    return (
        <div style={{ position: 'absolute', zIndex: 1 }}>
            <button type="button" onClick={() => setFigureType(Figure.Line)}>Line</button>
            <button type="button" onClick={() => setFigureType(Figure.Rectangle)}>Rect</button>
            <button type="button" onClick={() => setFigureType(Figure.Circle)}>Circle</button>
            <FileUploader />
        </div>
    );
};
