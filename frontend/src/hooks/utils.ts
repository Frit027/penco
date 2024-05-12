import { TMouseCoordinates } from './interfaces';

/**
 * Get mouse cursor coordinates at any canvas scale
 * @param {MouseEvent} e - Mouse click event
 * @returns {TMouseCoordinates} The x and y coordinates of the mouse cursor
 */
export const getScaledMousePosition = (e: MouseEvent): TMouseCoordinates => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    return {
        x: ((e.pageX - rect.left) / rect.width) * canvas.width,
        y: ((e.pageY - rect.top) / rect.height) * canvas.height,
    };
};
