import { Router } from 'express';
import { check } from 'express-validator';

import { CrearUsuario, Login, VerificarToken } from '../controllers/usuario.controller.js';
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



export default router;
