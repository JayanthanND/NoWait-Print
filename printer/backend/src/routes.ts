import { Router } from 'express';
import * as ShopController from './controllers/shopController';
import * as OrderController from './controllers/orderController';
import * as UploadController from './controllers/uploadController';
import * as PricingController from './controllers/pricingController';

export const shopRoutes = Router();
shopRoutes.get('/shop/:id', ShopController.getShop);

export const orderRoutes = Router();
orderRoutes.post('/order', OrderController.createOrder);
orderRoutes.get('/order/:id', OrderController.getOrder);

export const uploadRoutes = Router();
uploadRoutes.post('/upload', UploadController.uploadMiddleware, UploadController.analyzeFile);

export const pricingRoutes = Router();
pricingRoutes.post('/calculate', PricingController.calculatePrice);
pricingRoutes.get('/rules', PricingController.getPricingRules);
