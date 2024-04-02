import express from 'express';
import { body } from 'express-validator';

import userController from '../controllers/user.controller.js';

const router = express.Router();

// get info user
router.get('/', userController.getUser);

// change password
router.post('/changepw', [
    body('oldPassword')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password has to be valid.'),
    body('newPassword')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password has to be valid.')
        .custom((value, { req }) => {
            if (value === req.body.oldPassword) {
                throw new Error('New Password must differ the old.');
            }
            return true;
        }),
    body('confirmNewPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
], userController.changePassword);

// update
router.patch('/', [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name has to be valid.'),

    // body('phone')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('Phone Number has to be valid.'),

    // body('address')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('Address has to be valid.'),

], userController.editUser);
// evaluate product
router.post('/evaluate-product', [
    body('star')
        .trim()
        .notEmpty()
        .withMessage('Star has to be a number.'),
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('productId must not empty.'),
], userController.rating)
router.get('/evaluate-product/:rateId', userController.getRateByUser);
router.patch('/evaluate-product/:rateId', userController.updateRate);
// cart
router.get('/cart', userController.getCart);
router.post('/cart', userController.addToCart);
router.patch('/cart', userController.updateCart);
router.delete('/cart', userController.removeFromCart);
// order
router.get('/order', userController.getOrder);


export default router;