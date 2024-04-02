import React from 'react'

import classes from './StatusMess.module.css';

function StatusMess(props) {
    const state = props.state;
    let classname;
    if(state ==='error'){
        classname = classes.error;
    }else if (state ==='success'){
        classname = classes.success;
    }else if (state ==='warning'){
        classname = classes.warning;
    }else if (state ==='validation'){
        classname = classes.validation;
    }
    return (
        <div className={`${classname} ${classes.main}`}>{props.children}</div>
    )
}

export default StatusMess