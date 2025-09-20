import bcrypt from 'bcryptjs';

import UsuarioModelo from '../models/usuario.js';
import { GenerateToken } from '../helpers/generateToken.js';


export const CrearUsuario = async(req, res) => {
  try {
    
    const { contrasena } = req.body;

    const usuario = new UsuarioModelo(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.contrasena = bcrypt.hashSync(contrasena, salt);
  
    await usuario.save();
    
    const token = await GenerateToken( usuario._id ); 

    return res.status(201).json({
        ok: true,
        message: 'Usuario creado',
        usuario,
        token
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        ok: false,
        message: 'Error'
    })
  }
}

export const Login = async(req, res) => {
  try{

    const { correo, contrasena } = req.body;

    const usuario = await UsuarioModelo.findOne({correo});

    if(!usuario){
      return res.status(400).json({
        ok: false,
        message: 'Datos Incorrectos'
      })
    }

    // Validar Estado
    if(!usuario.estado){
      return res.status(400).json({
        ok: false,
        message: 'El usuario esta inactivo, contacte con el administrador ...'
      })
    }

    const validPassword = bcrypt.compareSync(contrasena, usuario.contrasena);

    if(!validPassword){
      return res.status(400).json({
        ok: false,
        message: 'Datos Incorrectos'
      })
    }

    const token = await GenerateToken( usuario._id ); 

    return res.status(201).json({
        ok: true,
        usuario,
        token
    })


  }catch(error){
    console.log(error);
    return res.status(500).json({
        ok: false,
        message: 'Error'
    })
  } 
}

export const VerificarToken = async(req, res) => {
  try {
      
    const token = await GenerateToken( req.usuario._id ); 

    return res.status(200).json({
      ok: true,
      usuario: req.usuario,
      token
    })

  }catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error'
    }) 
  }
}

