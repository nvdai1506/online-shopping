import React, { useContext, useState } from 'react'
import classes from './Sale.module.css';
import Api from '../../../service/api';
import StatusContext from '../../../context/status-context';
function Sale(props) {
  const statusCtx = useContext(StatusContext);
  const [percent, setPercent] = useState(props.data.sale);

  const onChangeHandler = event => {
    setPercent(event.target.value);
  }
  const onSubmitHandler = event => {
    event.preventDefault();
    Api.admin.onSale(props.data._id, { percent: percent })
      .catch(error => {
        console.log(error);
        statusCtx.setValue('error', 'Fail to add sale for this product.');
      })
  }
  return (
    <form onSubmit={onSubmitHandler}>
      <input className={classes.sale} value={percent} onChange={onChangeHandler} onBlur={onSubmitHandler} />
    </form>
  )
}
export default Sale