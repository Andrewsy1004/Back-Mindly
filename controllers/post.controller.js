
import { normalizarCategoria } from "../helpers/normalizarCategoria.js";
import postModelo from "../models/post.js";
import UsuarioModelo from '../models/usuario.js';


export const CrearNuevoPost = async(req, res) => {
    try {
        
        const {titulo, descripcion, imagen, categoria, tags} = req.body;

        const categoriaNormalizada = normalizarCategoria(categoria);

        const post = new postModelo({
            titulo,
            descripcion,
            imagen,
            categoria: categoriaNormalizada,
            tags,
            usuario: req.usuario._id
        });

        await post.save();

        return res.status(201).json({
            ok: true,
            message: 'Post creado',
            post
        })

    }catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: 'Error'
      })    
    }
}

export const ObtenerPosts = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const usuarioId = req.usuario._id;

    // Obtener datos del usuario actual
    const usuario = await UsuarioModelo.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    let posts;

    // Stopwords comunes en español
    const stopwords = [
      "a", "la", "el", "y", "en", "de", "del", "para", "un", "una",
      "los", "las", "con", "al", "por", "su", "se", "o", "que",
      "es", "son", "como", "más"
    ];

    // Función para limpiar texto y generar patrón regex
    function limpiarTexto(texto) {
      return texto
        .toLowerCase()
        .normalize("NFD") // quita tildes
        .replace(/[\u0300-\u036f]/g, "")
        .split(/\s+/)
        .filter(palabra => !stopwords.includes(palabra) && palabra.trim() !== "")
        .join("|");
    }

    let regexBiografiaProfesion = "";
    let regexProfesion = "";

    if (usuario.biografia || usuario.profesion) {
      regexBiografiaProfesion = limpiarTexto(
        (usuario.biografia || "") + " " + (usuario.profesion || "")
      );
      regexProfesion = limpiarTexto(usuario.profesion || "");
    }

    // CASO 1: Usuario sin biografía ni profesión -> Posts normales (más recientes)
    if (
      (!usuario.biografia || usuario.biografia.trim() === "") &&
      (!usuario.profesion || usuario.profesion.trim() === "")
    ) {
      posts = await postModelo
        .find({
          usuario: { $ne: usuarioId },
          estado: true,
        })
        .populate("usuario", "nombre fotoPerfil")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    // CASO 2: Usuario con biografía o profesión -> Posts personalizados
    else {
      posts = await postModelo.aggregate([
        {
          $match: {
            usuario: { $ne: usuarioId },
            estado: true,
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                // Coincidencias entre biografía y tags
                {
                  $size: {
                    $filter: {
                      input: "$tags",
                      cond: {
                        $regexMatch: {
                          input: usuario.biografia
                            ? usuario.biografia.toLowerCase()
                            : "",
                          regex: { $concat: [".*", "$$this", ".*"] },
                          options: "i",
                        },
                      },
                    },
                  },
                },
                // Coincidencias entre profesión y tags
                {
                  $size: {
                    $filter: {
                      input: "$tags",
                      cond: {
                        $regexMatch: {
                          input: usuario.profesion
                            ? usuario.profesion.toLowerCase()
                            : "",
                          regex: { $concat: [".*", "$$this", ".*"] },
                          options: "i",
                        },
                      },
                    },
                  },
                },
                // Coincidencias entre biografía/profesión y título
                {
                  $cond: [
                    regexBiografiaProfesion
                      ? {
                          $regexMatch: {
                            input: "$titulo",
                            regex: new RegExp(regexBiografiaProfesion, "i"),
                          },
                        }
                      : false,
                    2,
                    0,
                  ],
                },
                // Coincidencias entre profesión y categoría del post
                {
                  $cond: [
                    regexProfesion
                      ? {
                          $regexMatch: {
                            input: "$categoria",
                            regex: new RegExp(regexProfesion, "i"),
                          },
                        }
                      : false,
                    2,
                    0,
                  ],
                },
                // +1 punto si el post es reciente (última semana)
                {
                  $cond: [
                    {
                      $gte: [
                        "$createdAt",
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              ],
            },
          },
        },
        // Solo mostrar posts con score > 0
        {
          $match: { score: { $gt: 0 } },
        },
        // Ordenar primero por score y luego por fecha
        { $sort: { score: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: "usuarios",
            localField: "usuario",
            foreignField: "_id",
            as: "usuario",
          },
        },
        { $unwind: "$usuario" },
        {
          $project: {
            titulo: 1,
            descripcion: 1,
            imagen: 1,
            categoria: 1,
            tags: 1,
            createdAt: 1,
            updatedAt: 1,
            "usuario.nombre": 1,
            "usuario.fotoPerfil": 1,
            "usuario._id": 1,
            score: 1, 
          },
        },
      ]);

      // Numerar los posts en el resultado
      posts = posts.map((post, index) => ({
        numero: index + 1,
        ...post,
      }));
    }

    return res.status(200).json({
      ok: true,
      message: "Posts obtenidos correctamente",
      posts,
      criterio:
        usuario.biografia || usuario.profesion
          ? "personalizado_biografia_profesion"
          : "posts_recientes",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener posts",
    });
  }
};


export const ObtenerTodosLosPosts = async (req, res) => {
   try {
    
     const posts = await postModelo
       .find({ estado: true })
       .populate("usuario", "nombre fotoPerfil correo profesion ")
       .sort({ createdAt: -1 });
     
      // En caso de no tener posts
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "No se encontraron posts",
        });
      }

     return res.status(200).json({
       ok: true,
       message: "Posts obtenidos correctamente",
       posts,
     });

   } catch (error) {
     console.log(error);
     return res.status(500).json({
      ok: false,
      message: "Error al obtener posts",
    });
   } 
}

export const EliminarPostPorId = async (req, res) => {
  try {

    const { id } = req.params;
    
    // Buscar el post 
    const post = await postModelo.findById(id);
    if(!post){
      return res.status(404).json({
        ok: false,
        message: "Post no encontrado",
      });
    }
    
    // Verificar si el post pertenece al usuario
    if (post.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado",
      });
    }

    // Actualizar el post
    await postModelo.findByIdAndUpdate(id, { estado: false });
    
    return res.status(200).json({
      ok: true,
      message: "Post eliminado correctamente",
    });
    
  }catch (error) {
    console.log(error);
     return res.status(500).json({
      ok: false,
      message: "Error al obtener posts",
    });
  }
}

