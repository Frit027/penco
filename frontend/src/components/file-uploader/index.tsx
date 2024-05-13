import React, { useContext, ChangeEvent } from 'react';
import { PdfFileContext, TPdfFileContext } from '../../contexts';

export const FileUploader = () => {
    const { setPdfFile } = useContext(PdfFileContext) as TPdfFileContext;

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            const file = files[0];
            setPdfFile(file);

            const formData = new FormData();
            formData.append('file', file);

            await fetch('http://localhost:4000/api/file', {
                method: 'POST',
                body: formData,
            });
        }
    };

    return <input onChange={onChange} type="file" accept=".pdf" />;
};
