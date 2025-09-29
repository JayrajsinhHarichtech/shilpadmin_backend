import express from 'express';
import Tool from '../models/Tool.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Tool.find().sort({ key: 1 });
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  const t = new Tool(req.body);
  await t.save();
  res.status(201).json(t);
});

export default router;
