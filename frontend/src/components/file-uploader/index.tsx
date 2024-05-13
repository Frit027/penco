import React, { useContext, ChangeEvent } from 'react';
import { BlobUrlToPDFContext, TBlobUrlToPDFContext } from '../../contexts';
import { socket } from '../../socket';

export const FileUploader = () => {
    const { setBlobUrlToPDF } = useContext(BlobUrlToPDFContext) as TBlobUrlToPDFContext;

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            const formData = new FormData();
            formData.append('file', files[0]);

            const response = await fetch('http://localhost:4000/api/file', {
                method: 'POST',
                body: formData,
            });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setBlobUrlToPDF(url);
            socket.emit('url', { url });
        }
    };

    return <input onChange={onChange} type="file" accept=".pdf" />;
};
