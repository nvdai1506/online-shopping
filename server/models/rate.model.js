import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rateSchema = new Schema({
  rate: [{
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User'
    },
    order: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Order'
    },
    star: {
      type: Number,
      require: true
    },
    comment: {
      type: String
    },
    create: {
      type: Date,
      default: new Date().toISOString().slice(0, 10)
    }
  }],
  total: {
    type: Number,
    default: 0
  },
  average: {
    type: Number,
    default: 0
  }
});
const model = mongoose.model('Rate', rateSchema);

export default model;