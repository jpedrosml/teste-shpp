import express from 'express';
import { getGeminiContent } from '../controllers/geminiController';
import { confirmMeasure } from '../controllers/confirmationController';
import { listMeasures } from '../controllers/measureListController';

const router = express.Router();

router.post('/upload', getGeminiContent);

router.patch('/confirm', confirmMeasure);

router.get('/:customer_code/list', listMeasures);


export default router;