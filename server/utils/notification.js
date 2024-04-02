import webpush from 'web-push';
import Notification from '../models/notification.model.js';


export default async function pushNotification(topic, title, message, tag, productId = '') {
  webpush.setVapidDetails(
    "mailto:kiemtienol1506@gmail.com",
    process.env.WEBPUSH_PUBLIC_KEY,
    process.env.WEBPUSH_PRIVATE_KEY,
  );
  try {
    const data = await Notification.find({ topic: topic });
    const subs = data[0].subscriptions;
    const payload = JSON.stringify({ title: title, message: message, tag: tag, productId: productId });
    let count = 0;
    const subsLen = subs.length;
    const pushNotif = new Promise((resolve, reject) => {
      if (subs.length > 0) {
        for (const sub of subs) {
          webpush.sendNotification(sub, payload)
            .then(() => {
              count++;
              if (count === subsLen) {
                resolve();
              }
            })
            .catch(async err => {
              data[0].subscriptions.pull(sub);
              count++;
              if (count === subsLen) {
                resolve();
              }
            });
        }
      }

    })
    pushNotif.then(async () => {
      await data[0].save();
    })

  } catch (error) {
    throw new Error('Something wrong with notifications.')
  }
}