import Catalog from '../models/catalog.model.js';
import Product from '../models/product.model.js';
import Rate from '../models/rate.model.js';
import Order from '../models/order.model.js';

const helper = () => { };

helper.updateTotalOrder = async () => {
  try {
    const arrays = await Order.find();
    for (const element of arrays) {
      element.total = element.cart.totalPrice;
      element.save();
      // console.log(typeof (element));
    }
  } catch (error) {
    console.log(error);
  }
}

helper.addPaymentMethodToShippingInfo = async () => {
  try {
    const arrays = await Order.find();
    for (const element of arrays) {
      element.shippingInfo['paymentMethod'] = 1;
      element.save();
      // console.log(typeof (element));
    }
  } catch (error) {
    console.log(error);
  }
}


helper.resetRate = async () => {
  try {
    const rates = await Rate.find();
    for (const r of rates) {
      r.rate = [];
      r.total = 0;
      r.average = 0;
      r.save();
      // console.log(typeof (element));
    }
  } catch (error) {
    console.log(error);
  }
}

helper.addRateToProduct = async () => {
  try {
    const products = await Product.find();
    for (const p of products) {
      if (!p.rate) {
        const rate = new Rate({ rate: [] });
        const rate_result = await rate.save();

        p['rate'] = rate_result._id;
        p.save();
      }
      // console.log(typeof (element));
    }
  } catch (error) {
    console.log(error);
  }
}

helper.addPropertyToModel = async (key, value, Model) => {
  try {
    const arrays = await Model.find();
    for (const element of arrays) {
      element[key] = value;
      element.save();
      // console.log(typeof (element));
    }
  } catch (error) {
    console.log(error);
  }
}

helper.deletePropertyfromModel = async (key, modelName) => {
  let Model;
  if (modelName === 'Catalog') {
    Model = Catalog;
  } else if (modelName === 'Product') {
    Model = Product;
  }
  try {
    const arrays = await Model.find();
    for (const element of arrays) {
      element[key] = undefined;
      element.save();
    }
  } catch (error) {
    console.log(error);
  }
}
export default helper;