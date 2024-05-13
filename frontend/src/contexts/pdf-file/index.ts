import React, { createContext } from 'react';

export type TBlobUrlToPDFContext = {
    blobUrlToPDF: string | null,
    setBlobUrlToPDF: React.Dispatch<React.SetStateAction<string | null>>,
};

export const BlobUrlToPDFContext = createContext<TBlobUrlToPDFContext | null>(null);
