// =========================
// Puerto
// =========================

process.env.PORT = process.env.PORT || 3000;

// =========================
// ENTORNO
// =========================
// NODE_ENV (variable de entorno de heroku)
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================
// Base de datos
// =========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// URLDB (variable de entorno inventada)
process.env.URLDB = urlDB;