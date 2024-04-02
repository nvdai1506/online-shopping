import { validationResult } from 'express-validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';

import User from '../models/user.model.js';

import errorHandler from '../utils/errorHandler.js';


let auth = () => { };

auth.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
        email: req.body.email,
        password: password
    })
    try {
        const result = await user.save();

        res.status(201).json({ mess: 'Account is signed up.', id: result._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
auth.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw errorHandler.throwErr('User is not exist!', 401);
        }
        // const newpass = bcrypt.hashSync(password);
        const equal = await bcrypt.compare(password, user.password);
        if (!equal) {
            throw errorHandler.throwErr('Password is not correct!', 401);
        }

        const payload = {
            userId: user._id,
            role: user.role
        }
        const opts = {
            expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN // seconds
        }
        const accessToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET_KEY, opts);
        const refreshToken = randomstring.generate(80);

        user.rfToken = refreshToken;
        await user.save();

        // const decoded = jwt.verify(accessToken, 'nVdai1506');
        // console.log(decoded);
        res.json({
            authenticated: true,
            userId: user._id,
            accessToken,
            refreshToken,
            role: user.role
        })

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
auth.google_login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw errorHandler.throwErr('User is not exist!', 401);
        }
        const payload = {
            userId: user._id,
            role: user.role
        }
        const opts = {
            expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN // seconds
        }
        const accessToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET_KEY, opts);
        const refreshToken = randomstring.generate(80);

        user.rfToken = refreshToken;
        await user.save();
        res.json({
            authenticated: true,
            userId: user._id,
            accessToken,
            refreshToken,
            role: user.role
        })

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
auth.refresh = async (req, res, next) => {
    const { accessToken, refreshToken } = req.body;
    // console.log(accessToken);
    // console.log(refreshToken);
    try {
        const opts = {
            ignoreExpiration: true
        };
        // decode to get userID
        const { userId } = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET_KEY, opts);
        const user = await User.findById(userId);
        // console.log(user);
        if (!user) {
            throw errorHandler.throwErr('Could not find user!', 401);
        }
        if (user.rfToken.toString() !== refreshToken.toString()) {
            // console.log(user.rfToken.toString());
            // console.log(refreshToken.toString());
            throw errorHandler.throwErr('RefreshToken is revoked.', 401);
        }
        const payload = {
            userId: user._id,
            role: user.role
        }

        const newOpts = {
            expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN
        }

        const newAccessToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET_KEY, newOpts);

        res.status(200).json({ newAccessToken: newAccessToken });

    } catch (error) {
        next(errorHandler.throwErr('Invalid accessToken.', 401));
    }
}

export default auth;