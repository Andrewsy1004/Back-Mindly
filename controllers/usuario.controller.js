import bcrypt from 'bcryptjs';

import UsuarioModelo from '../models/usuario.js';
import { GenerateToken } from '../helpers/generateToken.js';
import { calcularSimilitud }  from '../helpers/Similitud.js';

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

export const ActualizarInfoUsuario = async (req, res) => { 
  try {
    
    const { uid } = req.body;
    
    // validar si el id del token es el mismo del body
    if (uid !== req.usuario._id.toString()) {
      return res.status(401).json({
        ok: false,
        message: 'No autorizado'
      });
    }

    const usuario = await UsuarioModelo.findById(uid);

    if(!usuario){
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe'
      })
    }

    const usuarioActualizado = await UsuarioModelo.findByIdAndUpdate(uid, req.body, { new: true });

    const token = await GenerateToken( usuarioActualizado._id );

    return res.status(200).json({
      ok: true,
      message: 'Informacion actualizada',
      usuarioActualizado,
      token
    })

  }catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error'
    }) 
  }
};


export const UsuariosSimilares = async (req, res) => {
  try {
     const usuarioBase = req.usuario;
     
     const usuarios = await UsuarioModelo.find({ _id: { $ne: usuarioBase._id } });

     const recomendaciones = usuarios
      .map(u => ({
        usuario: u,
        score: calcularSimilitud(usuarioBase, u)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
      
      return res.json({
       ok: true,
       usuarioBase: usuarioBase.nombre,
       similares: recomendaciones.map(r => ({
        id: r.usuario._id,
        nombre: r.usuario.nombre,
        correo: r.usuario.correo,
        profesion: r.usuario.profesion,
        similitud: r.score.toFixed(2),
        fotoPerfil: r.usuario.fotoPerfil
      }))
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error'
    }) 
  }
}