import { Router } from 'express';
import { check } from 'express-validator';

import { CrearNuevoPost, ObtenerPosts } from '../controllers/post.controller.js';

import {validarCampos} from '../middlewares/validarCampos.js';
import { ValidarJwt } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/crear-post',
    [
     ValidarJwt,
     check('titulo', 'El titulo es obligatorio').not().isEmpty(),
     check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
     check('imagen', 'La imagen es obligatoria').not().isEmpty(),
     check('categoria', 'La categoria es obligatoria').not().isEmpty(),
     check('tags', 'Los tags son obligatorios').isArray(),
     validarCampos
    ], 
  CrearNuevoPost
);

router.get('/post-recomendados',
  [
    ValidarJwt,
    // validarCampos
  ],
  ObtenerPosts
);


export default router;