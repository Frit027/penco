import React, { useContext, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
import { socket } from '../../socket';
import { BlobUrlToPDFContext, TBlobUrlToPDFContext } from '../../contexts';
import { PDFCanvas } from '../pdf-canvas';
import { TPDFDocument, TBlobUrlToPDF } from './interfaces';

export const PDFCanvasContainer = () => {
    const { blobUrlToPDF } = useContext(BlobUrlToPDFContext) as TBlobUrlToPDFContext;
    const [PDFDocuments, setPDFDocuments] = useState<TPDFDocument[]>([]);

    const getNewId = (prevPDFDocuments: TPDFDocument[]) => (prevPDFDocuments.length
        ? Math.max(...prevPDFDocuments.map(({ id }) => id)) + 1
        : 1);

    const savePDF = (url: string) => {
        const loadingPDFDoc = pdfjsLib.getDocument(url);
        loadingPDFDoc.promise.then((uploadedPDFDoc) => {
            setPDFDocuments((prevPDFDocuments) => [...prevPDFDocuments, {
                document: uploadedPDFDoc,
                id: getNewId(prevPDFDocuments),
            }]);
        });
    };

    useEffect(() => {
        socket.on('url', (data: TBlobUrlToPDF) => savePDF(data.url));

        return () => {
            socket.off('url');
        };
    }, []);

    useEffect(() => {
        if (!blobUrlToPDF) {
            return;
        }

        savePDF(blobUrlToPDF);
    }, [blobUrlToPDF]);

    return PDFDocuments.map((PDFDoc) => <PDFCanvas key={PDFDoc.id} PDFDoc={PDFDoc.document} id={PDFDoc.id} />);
};
