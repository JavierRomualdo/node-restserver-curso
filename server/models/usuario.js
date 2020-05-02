const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLER', 'USER_ROLE'],
    message: '{VALUE} no es rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        // required: [true, 'El rol es requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// no se debe retornar el password (no usar funcion de flecha)
// cuando se imprima un toJSON en usuarioSchema
// cuando hacemos hacemos los prototipos de los objetos de javascript
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// validar parametros (para parametros unicos por ejemplo el email) 
//si sale error envia el mensaje (email debe ser único)
usuarioSchema.plugin(uniqueValidator, { message: `{PATH} debe ser único` });

module.exports = mongoose.model('Usuario', usuarioSchema);