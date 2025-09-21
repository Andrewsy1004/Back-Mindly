import { Router } from 'express';

import { EjecutarSeed } from '../controllers/seed.controller.js';

const router = Router();


router.get('/ejecutar-seed', EjecutarSeed);



export default router;