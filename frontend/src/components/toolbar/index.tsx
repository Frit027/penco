import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Figure } from '../../interfaces';
import { FigureTypeContext, TFigureTypeContext } from '../../contexts';
import { FileUploader } from '../file-uploader';
import { classes } from './config';
import './styles.less';

/**
 * Component for displaying a toolbar
 */
export const Toolbar = () => {
    const { setFigureType } = useContext(FigureTypeContext) as TFigureTypeContext;
    const [selectedTool, setSelectedTool] = useState<Figure | null>(null);

    const changeCurrentTool = (figureType: Figure) => {
        setSelectedTool(figureType);
        setFigureType(figureType);
    };

    return (
        <div className={classes.component}>
            <button
                className={classNames(classes.button, {
                    [classes.selected]: selectedTool === Figure.Line,
                })}
                type="button"
                aria-label="Line"
                onClick={() => changeCurrentTool(Figure.Line)}
            >
                <span className={classNames(classes.icon, classes.line)} />
            </button>
            <button
                className={classNames(classes.button, {
                    [classes.selected]: selectedTool === Figure.Rectangle,
                })}
                type="button"
                aria-label="Rectangle"
                onClick={() => changeCurrentTool(Figure.Rectangle)}
            >
                <span className={classNames(classes.icon, classes.rectangle)} />
            </button>
            <button
                className={classNames(classes.button, {
                    [classes.selected]: selectedTool === Figure.Circle,
                })}
                type="button"
                aria-label="Circle"
                onClick={() => changeCurrentTool(Figure.Circle)}
            >
                <span className={classNames(classes.icon, classes.circle)} />
            </button>
            <FileUploader />
        </div>
    );
};
