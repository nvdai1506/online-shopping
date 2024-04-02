import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        shippingInfo: {
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            paymentMethod: {
                // 1: cod  2:momo  3:vnpay
                type: Number,
                required: true
            },
            note: {
                type: String
            },
        },
        cart: {
            items: [],
            totalPrice: {
                type: Number,
                require: true
            },
            totalAmount: {
                type: Number,
                require: true
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {//payment status
            type: Number, //0: ordering  1:ordered 2:cancel
            default: 0
        },
        shippingStatus: {
            type: Number, //0: shipping  1:delivered 2:cancel
            default: 0
        },
        percent: {
            type: Number,
            default: 0
        },
        vnd: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

const model = mongoose.model('Order', orderSchema);

export default model;