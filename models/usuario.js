import mongoose from 'mongoose';

const usuarioSchema  = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  contrasena: {
    type: String,
    required: true
  },
  roles: {
     type: [String], 
     enum: ['Administrador', 'Usuario'],
     default: ['Usuario'] 
  },
  profesion: {
    type: String,
    default: ""
  },
  biografia: {
    type: String,
    default: ""
  },
  fotoPerfil: {
    type: String, 
    default: ""
  },
  estado: {
    type: Boolean,
    default: true 
  }
}, {
  timestamps: true 
});

usuarioSchema.methods.toJSON = function (){
  const { __v, contrasena, _id, createdAt, updatedAt, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

const UsuarioModelo = mongoose.model('Usuario', usuarioSchema );
export default UsuarioModelo;