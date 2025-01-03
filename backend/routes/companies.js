import express from 'express';
import { getMatches, getCompany } from '../controllers/companyController.js';
const router = express.Router();

router.get('/:key', getMatches);

router.get('/info/:symbol', getCompany);

export default router