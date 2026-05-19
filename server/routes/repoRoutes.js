import express from 'express';
import { analyzeRepo, getAnalysisHistory, getAnalysisById, chatWithAnalysis } from '../controllers/repoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeRepo);
router.get('/history', protect, getAnalysisHistory);
router.post('/:id/chat', protect, chatWithAnalysis);
router.get('/:id', protect, getAnalysisById);

export default router;
