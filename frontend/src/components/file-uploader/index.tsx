import React, { useContext, useRef, ChangeEvent } from 'react';
import classNames from 'classnames';
import { BlobUrlToPDFContext, TBlobUrlToPDFContext } from '../../contexts';
import { socket } from '../../socket';
import { classes as toolbarClasses } from '../toolbar/config';
import { classes } from './config';
import './styles.less';

export const FileUploader = () => {
    const { setBlobUrlToPDF } = useContext(BlobUrlToPDFContext) as TBlobUrlToPDFContext;
    const inputRef = useRef<HTMLInputElement>(null);

    const clickFileInput = () => inputRef.current?.click();

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

    return (
        <button className={toolbarClasses.button} type="button" aria-label="PDF" onClick={clickFileInput}>
            <span className={classNames(toolbarClasses.icon, toolbarClasses.pdf)} />
            <input className={classes.component} ref={inputRef} onChange={onChange} type="file" accept=".pdf" />
        </button>
    );
};
