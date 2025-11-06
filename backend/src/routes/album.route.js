import { Router } from 'express';

const router = Router();

router.get("/", (req, res) => {
    res.send("this is album route GET method");
});

export default router