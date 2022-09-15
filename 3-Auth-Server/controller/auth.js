const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const { generarJWT }= require('../helpers/jwt');



const crearUsuario = async(req, res) =>{
    
    const {email, name, password} = req.body;
    
    try {
        //Verificar el email
        const usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }
        //Crear un usuario con el modelo
        const dbUser = new Usuario(req.body);

        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        await dbUser.save();

        return res.status(201).json({
            ok: true,
            msg: 'Usuario creado con exito',
            uid: dbUser.id,
            name,
            email,
            token
        });
        

        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con servicio técnico'
        });
    }
    

    
};

const login = async(req, res) =>{
    const {email, password} = req.body;
    
    try {
        const dbUser = await Usuario.findOne({email});
        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }
        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El contraseña no es correcta'
            });
        }

        //Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token

        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msj: 'hable con el administrador'
        });
    }
   
};

const revalidarToken = async(req, res) =>{
    
    const { uid} = req;

    //Leer base de datos
    const dbUser = await Usuario.findById(uid);

    const token = await generarJWT(uid, dbUser.name)
    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}


module.exports = {
    crearUsuario,
    login,
    revalidarToken
}