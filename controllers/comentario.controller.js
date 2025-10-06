import PostModelo from "../models/post.js";
import UsuarioModelo from "../models/usuario.js";
import ComentarioModelo from "../models/commentario.js";


export const CrearComentario = async (req, res) => {
  try {
    const { postid, descripcion } = req.body;

    // Validar campos requeridos
    if (!postid || !descripcion) {
      return res.status(400).json({
        ok: false,
        message: "El postId y la descripción son obligatorios.",
      });
    }

    // Verificar existencia del post
    const postExistente = await PostModelo.findById(postid);
    if (!postExistente) {
      return res.status(404).json({
        ok: false,
        message: "El post no existe.",
      });
    }

    // Verificar existencia del usuario autenticado
    const usuarioId = req.usuario?._id;
    const usuarioExistente = await UsuarioModelo.findById(usuarioId);
    if (!usuarioExistente) {
      return res.status(404).json({
        ok: false,
        message: "El usuario no existe.",
      });
    }

    // Crear comentario
    const nuevoComentario = new ComentarioModelo({
      descripcion,
      post: postid,
      usuario: usuarioId,
    });

    // Guardar en la base de datos
    await nuevoComentario.save();

    return res.status(201).json({
      ok: true,
      message: "Comentario creado correctamente.",
      comentario: nuevoComentario,
    });

  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor al crear el comentario.",
      error: error.message,
    });
  }
};


export const ObtenerTodosLosComentarios = async (req, res) => {
  try {
    const comentarios = await ComentarioModelo.find({ estado: true })
                              .populate('post', 'titulo')
                              .populate('usuario', 'nombre fotoPerfil correo profesion');

    return res.status(200).json({
      ok: true,
      message: "Comentarios obtenidos correctamente.",
      comentarios,
    });

  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor al obtener los comentarios.",
      error: error.message,
    });
  }
};

export const EliminarComentarioPorId = async (req, res) => {
   try {

     const { id } = req.params;

     const comentario = await ComentarioModelo.findById(id);

     if (!comentario) {
      return res.status(404).json({
        ok: false,
        message: "Comentario no encontrado.",
      });
     }   

     if (comentario.usuario.toString() !== req.usuario._id.toString()) {
       return res.status(401).json({
        ok: false,
        message: "No autorizado.",
       });
     }

     await ComentarioModelo.findByIdAndUpdate(id, { estado: false });

     return res.status(200).json({
       ok: true,
       message: "Comentario eliminado correctamente.",
     });


   }catch (error) {
     console.error("Error:", error);
     return res.status(500).json({
      ok: false,
      message: "Error del servidor al obtener los comentarios.",
      error: error.message,
    });
   }
}