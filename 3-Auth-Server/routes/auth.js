const { Router } = require('express');
const { check } = require('express-validator');
const {crearUsuario, login, revalidarToken} = require('../controller/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


//Crear un usuario
router.post('/register',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','la contraseña es obligatorio').isLength({min: 6}),
    validarCampos
], crearUsuario);

//Login un usuario
router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','la contraseña es obligatorio').isLength({min: 6}),
    validarCampos
], login);

//Validar y revalidar token
router.get('/renew', validarJWT ,revalidarToken);

module.exports = router;