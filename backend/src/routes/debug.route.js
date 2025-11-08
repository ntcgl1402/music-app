import { Router } from 'express';
import { User } from '../models/user.model.js';

const router = Router();

// Return recent users for debugging
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ count: users.length, users });
    } catch (error) {
        next(error);
    }
});

export default router;
