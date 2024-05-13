import React, { createContext } from 'react';

export type TPdfFileContext = {
    pdfFile: File | null,
    setPdfFile: React.Dispatch<React.SetStateAction<File | null>>,
};

export const PdfFileContext = createContext<TPdfFileContext | null>(null);
