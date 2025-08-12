import { Router } from 'express';
import {serverHealthController } from '../controllers/serverHealthController';

const router = Router();

router.get('/', serverHealthController);

export default router;