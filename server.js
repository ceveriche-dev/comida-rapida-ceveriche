
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_comida',
    password: 'comida1234!',
    database: 'comida_rapida'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL correctamente');
});

app.get('/', (req, res) => {
    res.send('Servidor de comida rápida funcionando');
});

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});