import React from 'react'
import classes from './Loading.module.css';

function Loading(props) {
    return (
        <div className={`${classes["sbl-seven-circles"]} ${props.className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default Loading