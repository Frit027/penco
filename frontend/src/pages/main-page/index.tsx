import React, { useMemo, useState } from 'react';
import { Figure } from '../../interfaces';
import { FigureTypeContext, PdfFileContext } from '../../contexts';
import { Toolbar } from '../../components/toolbar';
import { DrawingCanvas } from '../../components/drawing-canvas';
import { PDFCanvas } from '../../components/pdf-canvas';

export const MainPage = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [figureType, setFigureType] = useState<Figure | null>(null);

    const figureTypeContextValue = useMemo(() => ({
        figureType, setFigureType,
    }), [figureType, setFigureType]);

    const pdfFileContextValue = useMemo(() => ({
        pdfFile, setPdfFile,
    }), [pdfFile, setPdfFile]);

    return (
        <FigureTypeContext.Provider value={figureTypeContextValue}>
            <PdfFileContext.Provider value={pdfFileContextValue}>
                <Toolbar />
                <DrawingCanvas />
                <PDFCanvas />
            </PdfFileContext.Provider>
        </FigureTypeContext.Provider>
    );
};
