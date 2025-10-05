import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripción del comentario es obligatoria'],
    trim: true
  },
  estado: {
    type: Boolean,
    default: true
  },

  // Relación con el Post
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', 
    required: true
  },

  // Relación con el Usuario (autor del comentario)
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true 
});

// Para formatear la respuesta JSON
comentarioSchema.methods.toJSON = function () {
  const { __v, _id, ...comentario } = this.toObject();
  comentario.uid = _id;
  return comentario;
};

const ComentarioModelo = mongoose.model('Comentario', comentarioSchema);
export default ComentarioModelo;
