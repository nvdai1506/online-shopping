import { validationResult } from 'express-validator';
import moment from 'moment';

import errorHandler from '../utils/errorHandler.js';
import Notification from '../models/notification.model.js';

const notif = () => { }

notif.subscribe = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorHandler.throwErr(errors.errors[0].msg, 422));
  }
  const { topic, subscription } = req.body;
  try {
    const topicData = await Notification.find({ topic: topic });
    // console.log(topicData);
    if (topicData.length > 0) {
      topicData[0].subscriptions.push(subscription);
      const result = await topicData[0].save();
      // console.log(result);
    }
  } catch (error) {
    next(errorHandler.defaultErr(error));
  }
}


export default notif;