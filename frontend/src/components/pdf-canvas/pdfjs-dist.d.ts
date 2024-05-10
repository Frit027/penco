declare module 'pdfjs-dist/webpack.mjs' {
    import * as pdfjs from 'pdfjs-dist';

    const pdfjsLib: typeof pdfjs;
    export = pdfjsLib;
}
