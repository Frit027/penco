import React, { useContext, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { useDrawingLine, useDrawingRectangle, useDrawingCircle } from '../../hooks';
import { TPDFCanvasProps } from './interfaces';
import { classes } from './config';
import './styles.less';

export const PDFCanvas = ({ PDFDoc, id }: TPDFCanvasProps) => {
    const { figureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const [currentPage, setCurrentPage] = useState(1);

    const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const originCanvasRef = useRef<HTMLCanvasElement>(null);

    useDrawingLine(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingRectangle(fakeCanvasRef, originCanvasRef, figureType);
    useDrawingCircle(fakeCanvasRef, originCanvasRef, figureType);

    const incrementPageNum = () => setCurrentPage((prevNum) => prevNum + 1);

    const decrementPageNum = () => setCurrentPage((prevNum) => prevNum - 1);

    useEffect(() => {
        PDFDoc.getPage(currentPage).then((page) => {
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

            page.render(renderContext);
        });
    }, [PDFDoc, currentPage]);

    return (
        <div className={classNames(classes.component, {
            [classes.firstCanvas]: id === 1,
            [classes.secondCanvas]: id === 2,
            [classes.thirdCanvas]: id === 3,
        })}
        >
            <canvas className={classes.originCanvas} id={`pdf-canvas-${id}`} ref={originCanvasRef} />
            <canvas className={classes.fakeCanvas} ref={fakeCanvasRef} />
            <div>
                <button type="button" onClick={decrementPageNum} disabled={currentPage === 1}>Prev</button>
                <button type="button" onClick={incrementPageNum} disabled={currentPage === PDFDoc.numPages}>
                    Next
                </button>
            </div>
        </div>
    );
};
