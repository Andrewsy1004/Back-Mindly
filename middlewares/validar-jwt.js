import Jwt from 'jsonwebtoken';
import UsuarioModelo from '../models/usuario.js';


export const ValidarJwt = async(req, res, next) => {
    const token = req.header('jsonwebtoken');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'there is no token in the request'
        });
    }

    try {
         const {uid} = Jwt.verify(token, process.env.SECRETORPRIVATEKEY);
         const usuario = await UsuarioModelo.findById(uid);
         
         if(!usuario || !usuario.estado ){
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no valido!'
            });
         }
         
         req.usuario = usuario;
         next();
    }catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido!'
        })
    }
}