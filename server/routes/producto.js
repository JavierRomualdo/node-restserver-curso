const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

// Obtener productos
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'usuario email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

// Obtener producto por ID
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    const id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    const termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: false,
                productos
            });
        });
});

// Crear un nuevo producto
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    const body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });
    
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // 201 => cuando se crea un nuevo registro (gente no lo usa otros si)
        res.status(201).json({ 
            ok: true,
            producto: productoDB
        });
    })
});

// Actualizar un nuevo producto
app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    const id = req.params.id;
    const body = req.body;

    // vamor a ver si existe ese ID
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save( (err, productoGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });
    /** 
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    });*/ 
});

// Borrar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    // cambiar el estado de disponible del producto (nada más)
    const id = req.params.id;
    const disponibleDB = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, disponibleDB, { new: true, runValidators: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto borrado'
        });
    });
});

module.exports = app;