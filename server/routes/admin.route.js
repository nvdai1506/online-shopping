import express from "express";
import { body } from 'express-validator';


import adminController from '../controllers/admin.controller.js';

const router = express.Router();

// create management account
router.get('/account', adminController.getManagementrAccounts);
router.post('/account', [
    body('email')
        .trim()
        .isEmail()
        .not()
        .isEmpty()
        .withMessage('Parent is not empty!'),

    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password has to be valid.')
], adminController.addManagementAccount);
router.delete('/account/:userId', adminController.deleteManagementAccount);

// <<<<<<<<<<<<catalog>>>>>>>>>>>>>>>
router.post('/catalog', [
    body('name').trim().not().isEmpty().withMessage('Name is not empty!')
], adminController.addCatalog);

router.patch('/catalog/:id', [
    body('name').trim().not().isEmpty().withMessage('Name is not empty!'),
    body('value').trim().not().isEmpty().withMessage('Value is not empty!')
], adminController.updateCatalog);

router.delete('/catalog/:id', adminController.deleteCatalog);


// <<<<<<<<<<<<childCatalog>>>>>>>>>>>>>>>

router.post('/childCatalog', [
    body('parent').trim().not().isEmpty().withMessage('Parent is not empty!'),
    body('title').trim().not().isEmpty().withMessage('title is not empty!')
], adminController.addChildCatalog);

router.patch('/childCatatlog/:childId', [
    body('parent').trim().not().isEmpty().withMessage('Parent is not empty!'),
    body('title').trim().not().isEmpty().withMessage('Title is not empty!'),
    body('value').trim().not().isEmpty().withMessage('Value is not empty!'),
],
    adminController.updateChildCatalog);

router.delete('/childCatalog/:childId', adminController.deleteChildCatalog);

// <<<<<<<<<<<<product>>>>>>>>>>>>>>>

// router.get('/products', adminController.getProducts);
// router.get('/product/:productId', adminController.getProductById);
// router.get('/products/:childCatalogId', adminController.getProductsByChildCatalogId);

router.post('/product', [
    body('title').trim().not().isEmpty().withMessage('title is not empty!'),
    body('material').trim().not().isEmpty().withMessage('material is not empty!'),
    body('size').trim().not().isEmpty().withMessage('size is not empty!'),
    body('price').trim().isFloat().withMessage('price is not string!'),
    body('childCatalog').trim().not().isEmpty().withMessage('childCatalog is not empty!')
], adminController.addProduct);

router.patch('/product/:productId', [
    body('title').trim().not().isEmpty().withMessage('title is not empty!'),
    body('material').trim().not().isEmpty().withMessage('material is not empty!'),
    body('size').trim().not().isEmpty().withMessage('size is not empty!'),
    body('price').trim().isFloat().withMessage('price is not empty!'),
    body('childCatalog').trim().not().isEmpty().withMessage('childCatalog is not empty!')
], adminController.updateProduct);

router.delete('/product/:productId', adminController.deleteProduct);

// add featured product
router.post('/featured-product', [
    body('productId').trim().not().isEmpty().withMessage('productId is not empty!')
], adminController.addFeaturedProduct);
router.delete('/featured-product/:productId', adminController.deleteFeaturedProduct);
// add sale to product
router.patch('/sale-product/:productId', [
    body('percent').trim().not().isEmpty().withMessage('Percent must not empty!')
], adminController.onSale);

// <<<<<<<<<<<<order>>>>>>>>>>>>>>>
router.get('/order/:status', adminController.getOrderByStatus);
router.patch('/order/:orderId', adminController.updateOrderStatus);
// overview
router.post('/overview', adminController.getOverview);
router.get('/history', adminController.getHistory);

// voucher
router.post('/voucher', [
    body('captcha').trim().not().isEmpty().withMessage('Captch must be not empty!'),
    body('fromDate').trim().not().isEmpty().withMessage('From Date must be not empty!'),
    body('toDate').trim().not().isEmpty().withMessage('To Date must be not empty!'),
], adminController.postVoucher);
router.get('/voucher', adminController.getVouchers);
router.delete('/voucher/:voucherId', adminController.deleteVoucher);


export default router;