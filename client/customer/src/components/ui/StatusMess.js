import React, { useEffect } from 'react'

import classes from './StatusMess.module.css';
import ErrorImage from '../../images/status_error.png';
import SuccessImage from '../../images/status_success.png';
import WarningImage from '../../images/status_warning.png';
import ValidationImage from '../../images/status_error.png';
import InfoImage from '../../images/status_info.png';

function StatusMess({ state, mess }) {
    let image;
    let classValue;
    if (state === 'error') {
        image = ErrorImage;
        classValue = classes.error;
    } else if (state === 'success') {
        image = SuccessImage;
        classValue = classes.success;
    } else if (state === 'warning') {
        image = WarningImage;
        classValue = classes.warning;
    } else if (state === 'validation') {
        image = ValidationImage;
        classValue = classes.validation;
    } else if (state === 'info') {
        image = InfoImage;
        classValue = classes.info;
    }
    const classmain = mess === '' ? classes.main_hide : classes.main;


    return (
        <div className={`${classValue} ${classmain}`}>
            <div className={classes.image}>
                <img src={image} alt={state} />
            </div>
            <span className={classes.text}>
                {mess}
            </span>
        </div>

    )
}

export default StatusMess