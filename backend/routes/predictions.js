import express from 'express';
import { getNextHour } from '../controllers/predictionController.js';
const router = express.Router();

router.get('/:symbol', getNextHour);

export default router