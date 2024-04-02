import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '../../service/api';
import CartContext from '../../context/cart-context';
import StatusContext from '../../context/status-context';
import LoadingBackDrop from '../loading/LoadingBackdrop';


function PaymentSucces() {
  const location = useLocation();
  const cartCtx = useContext(CartContext);
  const statusCtx = useContext(StatusContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  let searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const orderId = vnp_OrderInfo.split('_')[1];
    const status = (vnp_ResponseCode.toString() === '00' ? 1 : 2);

    Api.shop.udpateOrder(orderId, {
      status: status,
      shippingStatus: 0,
      secretKey: process.env.REACT_APP_SECRET_KEY_TO_UPDATE_ORDER
    })
      .then(result => { return result.json() })
      .then(data => {
        statusCtx.setValue('success', 'Bạn đã đặt hàng thành công.');
        cartCtx.clearCart();
        setLoading(false);
        navigate('/user/order-history');
      })
      .catch(error => {
        navigate('/error');
      })

  }, []);
  if (loading) {
    return <LoadingBackDrop />
  }
  return (
    <div></div>
  )

}



export default PaymentSucces