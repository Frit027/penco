import React, { useMemo, useState } from 'react';
import { Figure } from '../../interfaces';
import { FigureTypeContext, BlobUrlToPDFContext } from '../../contexts';
import { Toolbar } from '../../components/toolbar';
import { DrawingCanvas } from '../../components/drawing-canvas';
import { PDFCanvasContainer } from '../../components/pdf-canvas-container';

export const MainPage = () => {
    const [blobUrlToPDF, setBlobUrlToPDF] = useState<string | null>(null);
    const [figureType, setFigureType] = useState<Figure | null>(null);

    const figureTypeContextValue = useMemo(() => ({
        figureType, setFigureType,
    }), [figureType, setFigureType]);

    const pdfFileContextValue = useMemo(() => ({
        blobUrlToPDF, setBlobUrlToPDF,
    }), [blobUrlToPDF, setBlobUrlToPDF]);

    return (
        <FigureTypeContext.Provider value={figureTypeContextValue}>
            <BlobUrlToPDFContext.Provider value={pdfFileContextValue}>
                <Toolbar />
                <DrawingCanvas />
                <PDFCanvasContainer />
            </BlobUrlToPDFContext.Provider>
        </FigureTypeContext.Provider>
    );
};
