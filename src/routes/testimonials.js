import express from 'express';
import Testimonial from '../models/Testimonial.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  const t = new Testimonial(req.body);
  await t.save();
  res.status(201).json(t);
});

export default router;
