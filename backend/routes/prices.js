import express from 'express';
import { getDayPrices } from '../controllers/priceController.js';
const router = express.Router();

router.get('/day/:symbol', getDayPrices);

export default router