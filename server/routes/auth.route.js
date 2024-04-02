import express from "express";
import { body } from "express-validator";

import authController from '../controllers/auth.controller.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password has to be valid.')
], authController.login);
// login as google account
router.post('/google-login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
], authController.google_login);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-Mail address already exists!');
                }
            });
        }),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password has to be valid.'),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
], authController.signup);
router.post('/refresh', authController.refresh);

export default router;

