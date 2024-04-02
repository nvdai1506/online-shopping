import { validationResult } from 'express-validator';
import bcrypt from "bcryptjs";

import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Rate from '../models/rate.model.js';

import errorHandler from '../utils/errorHandler.js';

let user = () => { };

user.getUser = async (req, res, next) => {
    // const userId = req.params.userId;
    const userId = req.accessTokenPayload.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 422);
        }

        res.status(200).json({ user: user });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
user.changePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }

    // const userId = req.params.userId;
    const userId = req.accessTokenPayload.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    // console.log(req.body);

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        const equal = await bcrypt.compare(oldPassword, user.password);
        if (!equal) {
            throw errorHandler.throwErr('Old password is not correct!', 401);
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        user.password = newPasswordHash;
        await user.save();

        res.status(200).json({ mess: "Password is updated." });

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }

};
user.editUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    // const userId = req.params.userId;
    const userId = req.accessTokenPayload.userId;

    const { name, phone, address } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        user.name = name;
        user.phone = phone;
        user.address = address;
        const result = await user.save();

        res.json({ user: result });

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
// evaluate product
user.rating = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const userId = req.accessTokenPayload.userId;

    const { star, productId, comment, orderId } = req.body;

    try {
        if (Number(star) === 0) {
            throw errorHandler.throwErr('Star min is 1!', 403);
        }
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find Product!', 401);
        }
        const rateId = product.rate;
        // console.log('rateId: ', rateId);
        const rate = await Rate.findById(rateId);
        if (!rate) {
            throw errorHandler.throwErr('Could not find Rate!', 401);
        }


        const rates = rate.rate;
        const existedUser = rates.filter(r => { return r.user.toString() === userId.toString() && r.order.toString() === orderId.toString() })
        // console.log('existedUser: ', existedUser);

        if (existedUser.length > 0) {
            // console.log('existedUser');
            const order = await Order.findById(orderId);
            if (order.status === 1 && order.shippingStatus === 1) {
                const indexOfProduct = order.cart.items.findIndex(item => item.id.toString() === productId.toString() && item.rate === undefined);

                order.cart.items[indexOfProduct] = { ...order.cart.items[indexOfProduct], rate: rateId };
                await order.save();
                res.status(208).json({ mess: 'You already have rated this product.' });
            } else {
                throw errorHandler.throwErr('This order is not completed!', 403);
            }
        } else {
            rate.rate.push({
                user: userId,
                star: star,
                comment: comment,
                order: orderId
            });
            rate.total += 1;
            rate.average = (rate.average * (rate.total - 1) + Number(star)) / (rate.total);
            const result = await rate.save();

            const order = await Order.findById(orderId);
            if (order.status === 1 && order.shippingStatus === 1) {
                const indexOfProduct = order.cart.items.findIndex(item => item.id.toString() === productId.toString());
                // console.log(order.cart.items[indexOfProduct]);
                order.cart.items[indexOfProduct] = { ...order.cart.items[indexOfProduct], rate: rateId };
                const order_result = await order.save();
                // console.log(order_result._id);
                // console.log(order_result.cart.items[indexOfProduct]);
                res.status(200).json({ rateId: result._id });
            } else {
                throw errorHandler.throwErr('This order is not completed!', 403);
            }
        }


    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
user.getRateByUser = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    const rateId = req.params.rateId;
    const orderId = req.query.orderId;
    try {
        const rate = await Rate.findById(rateId);
        if (!rate) {
            throw errorHandler.throwErr('Could not find rate!', 204);
        }

        const rateByUser = rate.rate.filter(r => { return (r.user.toString() === userId.toString() && r.order.toString() === orderId.toString()) });
        res.status(200).json({ rate: rateByUser[0] });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
user.updateRate = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    const rateId = req.params.rateId;
    const { star, comment, orderId } = req.body;
    try {
        const rate = await Rate.findById(rateId);
        if (!rate) {
            throw errorHandler.throwErr('Could not find rate!', 204);
        }
        const userIndex = rate.rate.findIndex(r => { return (r.user.toString() === userId.toString() && r.order.toString() === orderId.toString()) });
        if (rate.total === 1) {
            rate.average = Number(star);
        } else {
            const preAvg = (rate.average * rate.total - rate.rate[userIndex].star) / (rate.total - 1);
            rate.average = (preAvg * (rate.total - 1) + Number(star)) / (rate.total);
        }

        const newRate = {
            user: rate.rate[userIndex].user,
            order: rate.rate[userIndex].order,
            star,
            comment
        }

        rate.rate[userIndex] = newRate;
        const result = await rate.save();
        res.status(200).json({ newRate: result.rate[userIndex] });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
// cart
user.getCart = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    try {
        const user = await User.findById(userId).populate('cart.items.product');
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
user.addToCart = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    const productId = req.body.productId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find product!', 401);
        }
        await user.addToCart(product);
        const loadUser = await User.findById(userId).populate('cart.items.product');
        const newCart = loadUser.cart;
        res.status(200).json({ mess: "Product is added to cart.", cart: newCart });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }

};
user.updateCart = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    const cart = req.body.cart;
    // console.log(cart);
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        const result = await user.updateCart(cart);
        // console.log(result);
        res.status(200).json({ cart: result.cart });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
user.removeFromCart = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    const productId = req.body.productId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find product!', 401);
        }
        await user.removeFromCart(product);

        res.status(200).json({ mess: "Product is removed." });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
};
// order
user.getOrder = async (req, res, next) => {
    const userId = req.accessTokenPayload.userId;
    if (!userId) {
        return next(errorHandler.throwErr('Can not find User!', 401));
    }
    try {
        const user = await User.findById(userId).populate('orders');
        if (!user) {
            throw errorHandler.throwErr('Can not find User!', 401);
        }
        res.status(200).json({ orders: user.orders });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

export default user;