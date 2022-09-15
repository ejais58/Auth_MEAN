const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {

        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    //todo ok
    next();
};

module.exports ={
    validarJWT
}