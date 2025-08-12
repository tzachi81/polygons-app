import { Router } from 'express';
import { getPolygons, createPolygon, deletePolygon } from '../controllers/polygonController';

const router = Router();

router.get('/', getPolygons);
router.post('/', createPolygon);
router.delete('/:id', deletePolygon);

export default router;