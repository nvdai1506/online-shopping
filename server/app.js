import path from 'path';
import { fileURLToPath } from 'url';

import * as dotenv from 'dotenv';

import express from 'express';
import morgan from 'morgan';//logger
import helmet from 'helmet';//for header security
import mongoose from 'mongoose';
import cors from "cors";
import { v4 } from 'uuid';
import multer from 'multer';//serve for files

import AdminRouter from './routes/admin.route.js';
import AuthRouter from './routes/auth.route.js';
import UserRouter from './routes/user.route.js';
import ShopRouter from './routes/shop.route.js';
import PaymentRouter from './routes/payment.route.js';
import NotificationRouter from './routes/notification.route.js';
import Auth from './middlewares/auth.mdw.js';

// import helper from './utils/helper.js';
// import Order from './models/order.model.js';
// import pushNotification from './utils/notification.js';
// import Notification from './models/notification.model.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const test = dotenv.config({ path: __dirname + '/.env' });
// console.log(test);

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
// let whitelist = ["http://localhost:3000"];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.warn(`Origin '${origin}' is not in the white list:`, whitelist);
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, v4() + '-' + file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', AuthRouter);
app.use('/shop', ShopRouter);
app.use('/payment', PaymentRouter);
app.use('/notification', NotificationRouter);
app.use('/admin', Auth, AdminRouter);
app.use('/user', Auth, UserRouter);

app.use((error, req, res, next) => {
  console.log(error.message);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get('/hello', (req, res, next) => {
  res.json({ mess: "hello from nodejs" });
})

// pushNotification('all', 'test title', 'message test', 'tag test');

const PORT = process.env.PORT || 8080;
console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(result => {
  // helper.resetRate();
  // helper.addPaymentMethodToShippingInfo();
  // helper.addPropertyToModel('percent', 0, Order);
  // helper.updateTotalOrder();
  // const testn = new Notification({ topic: 'test', subscriptions: [] });
  // await testn.save();
  app.listen(PORT, function () {
    console.log(`Server is listening at http://localhost:${PORT}`);
  });
}).catch(err => console.log(err));

