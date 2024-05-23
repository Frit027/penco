import { type PDFDocumentProxy } from 'pdfjs-dist';

export type TBlobUrlToPDF = {
    url: string,
};

export type TPDFDocument = {
    document: PDFDocumentProxy,
    id: number,
};
