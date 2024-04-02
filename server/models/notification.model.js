import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  topic: {
    type: String,
    require: true,
    default: 'all'
  },
  subscriptions: [{
    type: Object,
    require: true,
    default: []
  }]
});

const model = mongoose.model('Notification', notificationSchema);

export default model;