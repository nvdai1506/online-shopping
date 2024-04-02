import React from 'react'

import classes from './Select.module.css';

const Select = (props) => {
    return (
        <div className={`${classes['select-option']} ${props.className}`}>
            <select onChange={props.onChange} value={props.value} onClick={props.onClick}>
                {props.children}
                <option value='0'>{props.title}</option>
                {props.values.map(value => <option key={`${value._id}_select`} value={value._id}>{value.name || value.title}</option>)}
            </select>
        </div>

    );
}

export default Select