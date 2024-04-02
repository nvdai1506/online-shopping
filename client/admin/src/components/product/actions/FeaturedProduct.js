import React, { useContext, useState } from 'react'
import Api from '../../../service/api';
import StatusContext from '../../../context/status-context';
function FeaturedProduct(props) {

  const statusCtx = useContext(StatusContext);
  const [check, setCheck] = useState(props.data.featuredProduct);
  const checkboxHandler = event => {
    setCheck(event.target.checked);
    if (event.target.checked) {
      Api.admin.addFeaturedProduct({ productId: props.data._id })
        .then(result => {
          // console.log(result);
          if (result.status === 200) {
            statusCtx.setValue('success', `${props.data._id} is added to Featured Products.`);
          }
        })
        .catch(error => {
          if (error.status === 403) {
            error.json()
              .then(err => {
                statusCtx.setValue('error', err.message);
              })
          } else {
            statusCtx.setValue('error', 'Fail to add this product to Featured Products.');
          }
          setCheck(false);
        })
    } else {
      Api.admin.deletetFeaturedProduct(props.data._id)
        .then(result => {
          if (result.status === 200) {
            statusCtx.setValue('success', `${props.data._id} is deleted from Featured Products.`);
          }
        })
        .catch(error => {
          console.log(error);
          statusCtx.setValue('error', 'Fail to delete this product to Featured Products.');
          setCheck(false);

        })
    }

  }
  return (
    <div>
      <input type='checkbox' id="featured_product" onChange={checkboxHandler} checked={check} />
    </div>
  )
}

export default FeaturedProduct