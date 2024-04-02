import express from 'express';
import { body } from 'express-validator';

import shopController from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/catalog', shopController.getCatalog);

// childCatalog
router.get('/childCatalog/:catalogId', shopController.getChildCatalog);


// <<<<<<<<<<<<product>>>>>>>>>>>>>>>
router.get('/products', shopController.getProducts);
router.get('/:value', shopController.getProductByType);
router.get('/product/:productId', shopController.getProductById);
router.get('/products/:childCatalogId', shopController.getProductsByChildCatalogId);
// featured product
router.get('/featured-products/:CatalogValue', shopController.getFeaturedProducts);
// rate
router.get('/rate/:rateId', shopController.getRate);

// order

router.post('/order', shopController.postOrder);
router.patch('/order/:orderId', shopController.updateOrder);
// voucher
router.post('/voucher-check', [
  body('captcha').trim().not().isEmpty().withMessage('Captch must be not empty!'),
], shopController.checkVoucher);


export default router;