import React, { useState, useEffect, useContext } from 'react'
import StatusContext from '../../context/status-context';
import StatusMess from '../ui/StatusMess';
import classes from './StatusMessTimer.module.css';
const delay = 4;

function StatusMessTimer() {
  const statusCtx = useContext(StatusContext);
  const { state, mess, click } = statusCtx;
  const [classValue, setClassValue] = useState(`${classes.status_container}`);

  useEffect(() => {
    // console.log(click);
    setClassValue(`${classes.status_container} ${classes.status_open}`);
    let timer1 = setTimeout(() => {
      setClassValue(`${classes.status_container}`);
    }, delay * 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [click]);

  return (
    <div className={classValue}>
      <StatusMess state={state} mess={mess} />
    </div>
  )
}

export default React.memo(StatusMessTimer)