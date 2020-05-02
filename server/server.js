require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// importante rutas del usuario
app.use(require('./routes/usuario'));

// process.env.URLDB (cadena de conexion creada en la variable de entorno URLDB en config.js)
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(con => console.log('conectado !'))
    .catch(err => console.log('error'));

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});

module.exports = app;