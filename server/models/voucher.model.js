import mongoose from "mongoose";

const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    captcha: {
        type: String,
        require: true
    },
    percent: {
        type: Number,
        default: 0,
    },
    vnd: {
        type: Number,
        default: 0,
    },
    fromDate: {
        type: Date,
        require: true
    },
    toDate: {
        type: Date,
        require: true
    }

});

const model = mongoose.model('Voucher', voucherSchema);

export default model;