import { Router } from 'express';
import { check } from 'express-validator';

import { CrearComentario, EliminarComentarioPorId, ObtenerTodosLosComentarios } from '../controllers/comentario.controller.js';
import {validarCampos} from '../middlewares/validarCampos.js';
import { ValidarJwt } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/crear-comentario',
    [
        ValidarJwt,
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        check('postid', 'El postid es obligatorio').not().isEmpty(),
        check('postid', 'El postid no es valido, debe ser un id de mongo').isMongoId(),
        validarCampos
    ],
 CrearComentario
);

router.get('/obtener-comentarios', ObtenerTodosLosComentarios);

router.delete('/eliminar-comentario/:id',[ValidarJwt], EliminarComentarioPorId);

export default router;