export type TMouseCoordinates = {
    x: number,
    y: number,
};

export type TSocketData<TFigureProperties> = TFigureProperties & {
    canvasId: string,
};
