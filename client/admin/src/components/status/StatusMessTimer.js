import React, { useState, useEffect, useContext } from 'react'
import StatusContext from '../../context/status-context';
import StatusMess2 from '../ui/StatusMess2';
import classes from './StatusMessTimer.module.css';
const delay = 10;

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
      <StatusMess2 state={state} mess={mess} />
    </div>
  )
}

export default React.memo(StatusMessTimer)