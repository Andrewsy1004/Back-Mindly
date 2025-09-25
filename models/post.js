import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  imagen: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
  },
  tags: {
    type: [String], 
    default: []
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', 
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

postSchema.methods.toJSON = function () {
  const { __v, _id, ...post } = this.toObject();
  post.uid = _id;
  return post;
};

const PostModelo = mongoose.model('Post', postSchema);
export default PostModelo;
