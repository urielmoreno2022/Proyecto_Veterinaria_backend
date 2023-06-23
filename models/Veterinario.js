import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,        //Eliminamos los espacios en blanco
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,    //sea único correo para registrarse, no acepta duplicados
        trim: true,
    },
    telefono:{
        type: String,
        default: null,
        trim: true,
    },
    web:{
        type: String,
        default: null,
    },
    token:{
        type: String,
        default: generarId(), //genera un token único
    },
    confirmado:{
        type: Boolean,
        default: false,
    }

});

veterinarioSchema.pre("save", async function (next){
    if (!this.isModified('password')){  //un password que ya está hasheado no lo vuelva a hashear.
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario,this.password);
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema); //registrarlo como modelo y la forma.
export default Veterinario;  //de esta forma lo puedo importar en otros archivos.