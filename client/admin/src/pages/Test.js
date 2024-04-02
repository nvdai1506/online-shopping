import React from 'react'
import Loading from '../components/ui/Loading'
import classes from './Test.module.css';
function Test() {
    return (
        <div className={classes.main}>
            <h1>Testing...</h1>
            <div>
                <Loading />
            </div>
        </div>
    )
}

export default Test