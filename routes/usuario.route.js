import { Router } from 'express';
import { check } from 'express-validator';

import { ActualizarInfoUsuario, CrearUsuario, Login, ObtenerUsuarioPorId, UsuariosSimilares, VerificarToken } from '../controllers/usuario.controller.js';
import { emailExiste  } from '../helpers/dbValidator.js';

import {validarCampos} from '../middlewares/validarCampos.js';
import { ValidarJwt } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/crear-usuario',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
        check('correo', 'El correo es obligatorio').isEmail(),
        check("correo").custom(emailExiste),
        validarCampos
    ],
    CrearUsuario
);


router.post('/iniciar-sesion',
    [
        check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
        check('correo', 'El correo es obligatorio').isEmail(),
        validarCampos
    ],
    Login
);


router.get('/verificar-token', [ValidarJwt], VerificarToken);

router.put('/actualizar-usuario', 
  [
    ValidarJwt, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('profesion', 'La profesion es obligatoria').not().isEmpty(),
    check('biografia', 'La biografia es obligatoria').not().isEmpty(),
    check('uid', 'El uid es obligatorio').not().isEmpty(),
    check('uid', 'El uid es debe ser de mongo').isMongoId(),
    validarCampos
  ], 
  ActualizarInfoUsuario 
);

router.get('/obtener-usuario-gustos-similares', [ValidarJwt], UsuariosSimilares);

router.get('/usuarios/:id',
  [
    check('id', 'El uid es obligatorio').not().isEmpty(),
    check('id', 'El id no es válido, debe ser un id de mongo').isMongoId(),
    validarCampos
  ],
  ObtenerUsuarioPorId
);

export default router;
