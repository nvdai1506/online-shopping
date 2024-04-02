import { validationResult } from 'express-validator';
import config from 'config';
import dateFormat from 'dateformat';
import querystring from 'qs';
// import crypto from 'crypto';
import errorHandler from '../utils/errorHandler.js';
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
let payment = () => { }
payment.postCreatePaymentUrl = async (req, res, next) => {
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // let config = require('config');
  // let dateFormat = require('dateformat');


  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');

  let date = new Date();

  let createDate = dateFormat(date, 'yyyymmddHHmmss');
  let orderId = dateFormat(date, 'HHmmss');
  // req.body
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  let orderInfo = req.body.orderDescription;
  let orderType = req.body.orderType;
  let locale = req.body.language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }

  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  // let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  const { createHmac } = await import('node:crypto');
  // let crypto = require("crypto");
  let hmac = createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.status(200).json({ vnpUrl });
}
payment.getVnpayReturn = async (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  // let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let signData = querystring.stringify(vnp_Params, { encode: false });

  const { createHmac } = await import('node:crypto');

  let hmac = createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    res.status(200).json({ code: vnp_Params['vnp_ResponseCode'] });
  } else {
    res.status(200).json({ code: '97' });
  }
}



payment.getVnpayIpn = async (req, res, next) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = config.get('vnp_HashSecret');
  let signData = querystring.stringify(vnp_Params, { encode: false });

  const { createHmac } = await import('node:crypto');

  let hmac = createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


  if (secureHash === signed) {
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: '00', Message: 'success' })
  }
  else {
    res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
  }
}

export default payment;