
// =================
// Verifica Token
// =================

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ // 401 => no autorizado
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario; // decoded (paylond)

        next();
    });

    // console.log(token);
    // next();
    // res.json({
    //     token
    // });
}

let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }   

}

// ==========================
// Verifica token para imagen
// ==========================


let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ // 401 => no autorizado
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario; // decoded (paylond)

        next();
    });

    // res.json({
    //     token
    // });
}

module.exports = {
    verificaToken,
    verificarAdmin_Role,
    verificaTokenImg
}