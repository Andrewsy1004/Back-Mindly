import bcrypt from 'bcryptjs';

import UsuarioModelo from '../models/usuario.js';
import PostModelo from '../models/post.js';
import usuariosSeed from '../seed/seed.json' with { type: "json" };


export const EjecutarSeed = async(req, res) => {
    try {
      
        // 1. Limpiar colecciones
        await UsuarioModelo.deleteMany({});
        await PostModelo.deleteMany({});

        // 2. Crear usuarios
        const usuarios = usuariosSeed.Usuarios;
        const usuariosConHash = await Promise.all(
           usuarios.map(async (usuario) => {
               const salt = await bcrypt.genSalt(10);
               const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
               return { ...usuario, contrasena: hashedPassword };
           })
        );

        const usuariosCreados = await UsuarioModelo.insertMany(usuariosConHash);
        
        // 3. Usar el ID del primer usuario para todos los posts
        const primerUsuarioId = usuariosCreados[0]._id;

        // 4. Crear posts asociados al primer usuario
        const posts = usuariosSeed.Posts;
        const postsConUsuario = posts.map(post => ({
            titulo: post.titulo,
            descripcion: post.descripcion,
            imagen: post.imagen,
            categoria: post.categoria,
            tags: post.tags,
            usuario: primerUsuarioId 
        }));

        await PostModelo.insertMany(postsConUsuario);

        return res.status(200).json({
            ok: true,
            message: 'Seed ejecutada correctamente',
            data: {
                usuariosCreados: usuariosCreados.length,
                postsCreados: postsConUsuario.length,
                todosLosPostsDe: usuariosCreados[0].nombre
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al ejecutar seed',
            error: error.message
        });   
    }
}