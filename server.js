
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_comida',
    password: 'Comida1234!',
    database: 'comida_rapida'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL correctamente');
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de comida rápida funcionando');
});

// Guardar cliente y pedido
app.post('/api/pedidos', (req, res) => {

    const {
        nombre,
        telefono,
        correo,
        direccion,
        productos,
        total,
        metodo_pago
    } = req.body;

    // Verificar que llegaron los datos
    if (!nombre || !telefono || !correo || !direccion ||
        !productos || !total || !metodo_pago) {

        return res.status(400).json({
            mensaje: 'Faltan datos del pedido'
        });
    }

    // Primero guardamos el cliente
    const sqlCliente = `
        INSERT INTO clientes
        (nombre, telefono, correo, direccion)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sqlCliente,
        [nombre, telefono, correo, direccion],
        (err, resultadoCliente) => {

            if (err) {
                console.error('Error al guardar cliente:', err);

                return res.status(500).json({
                    mensaje: 'Error al guardar el cliente'
                });
            }

            const clienteId = resultadoCliente.insertId;

            // Después guardamos el pedido
            const sqlPedido = `
                INSERT INTO pedidos
                (cliente_id, productos, total, metodo_pago)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sqlPedido,
                [
                    clienteId,
                    JSON.stringify(productos),
                    total,
                    metodo_pago
                ],
                (err, resultadoPedido) => {

                    if (err) {
                        console.error('Error al guardar pedido:', err);

                        return res.status(500).json({
                            mensaje: 'Error al guardar el pedido'
                        });
                    }

                    res.json({
                        mensaje: 'Pedido guardado correctamente',
                        cliente_id: clienteId,
                        pedido_id: resultadoPedido.insertId
                    });
                }
            );
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});