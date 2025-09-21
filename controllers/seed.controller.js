import bcrypt from 'bcryptjs';

import UsuarioModelo from '../models/usuario.js';
import usuariosSeed from '../seed/seed.json' with { type: "json" };


export const EjecutarSeed = async(req, res) => {
    try {
        const usuarios = usuariosSeed.Usuarios;

        // Encriptar las contraseñas
        const usuariosConHash = await Promise.all(
           usuarios.map(async (usuario) => {
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
           return { ...usuario, contrasena: hashedPassword };
           })
        );

        await UsuarioModelo.deleteMany({});
        await UsuarioModelo.insertMany(usuariosConHash);

        return res.status(200).json({
          ok: true,
          message: 'Seed ejecutada correctamente'
        })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: 'Error'
      })   
    }
}