import React, {
    useContext, useState, useRef, useEffect,
} from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
import { type PDFDocumentProxy } from 'pdfjs-dist';
import { FigureTypeContext, TFigureTypeContext, PdfFileContext, TPdfFileContext } from '../../contexts';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';

export const PDFCanvas = () => {
    const { figureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const { pdfFile } = useContext(PdfFileContext) as TPdfFileContext;

    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState<number>();

    const originCanvasRef = useRef<HTMLCanvasElement>(null);
    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    const incrementPageNum = () => setCurrentPage((prevNum) => prevNum + 1);

    const decrementPageNum = () => setCurrentPage((prevNum) => prevNum - 1);

    useEffect(() => {
        if (!pdfFile) {
            return;
        }

        const readAsArrayBuffer = async () => {
            const arrayBuffer = await pdfFile.arrayBuffer();
            return arrayBuffer;
        };

        const arrayBufferPromise = readAsArrayBuffer();
        arrayBufferPromise.then((arrayBuffer) => {
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            loadingTask.promise.then((pdf) => {
                setPdfDoc(pdf);
                setTotalPageCount(pdf.numPages);
            });
        });
    }, [pdfFile]);

    useEffect(() => {
        if (!pdfDoc) {
            return;
        }

        pdfDoc.getPage(currentPage).then((page) => {
            if (!originCanvasRef.current || !fakeCanvasRef.current) {
                return;
            }

            const originCanvas = originCanvasRef.current;
            const fakeCanvas = fakeCanvasRef.current;
            const canvasContext = originCanvas.getContext('2d') as CanvasRenderingContext2D;
            const viewport = page.getViewport({ scale: 0.7 });

            const resolution = 2.5;

            originCanvas.height = resolution * viewport.height;
            originCanvas.width = resolution * viewport.width;
            originCanvas.style.height = `${viewport.height}px`;
            originCanvas.style.width = `${viewport.width}px`;

            fakeCanvas.height = resolution * viewport.height;
            fakeCanvas.width = resolution * viewport.width;
            fakeCanvas.style.height = `${viewport.height}px`;
            fakeCanvas.style.width = `${viewport.width}px`;

            const renderContext = {
                canvasContext,
                viewport,
                transform: [resolution, 0, 0, resolution, 0, 0],
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                console.log('Page rendered');
            });
        });
    }, [pdfDoc, currentPage]);

    return (
        <div style={{ position: 'absolute', left: '610px', border: '1px solid red' }}>
            <canvas ref={originCanvasRef} />
            <canvas ref={fakeCanvasRef} style={{ position: 'absolute', left: 0 }} />
            <div>
                <button type="button" onClick={decrementPageNum} disabled={currentPage === 1}>Prev</button>
                <button type="button" onClick={incrementPageNum} disabled={currentPage === totalPageCount}>Next</button>
            </div>
        </div>
    );
};
