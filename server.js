const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// CONEXIÓN A MYSQL
// ========================================

const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_comida',
    password: 'Comida1234!',
    database: 'comida_rapida'
});


db.connect((err) => {

    if (err) {

        console.error(
            'Error al conectar con MySQL:',
            err
        );

        return;
    }

    console.log(
        'Conectado a MySQL correctamente'
    );

});


// ========================================
// RUTA DE PRUEBA
// ========================================

app.get('/', (req, res) => {

    res.send(
        'Servidor de comida rápida funcionando'
    );

});


// ========================================
// LOGIN DE USUARIOS
// ========================================

app.post('/api/login', (req, res) => {

    const {
        correo,
        password
    } = req.body;


    if (!correo || !password) {

        return res.status(400).json({
            mensaje: 'Correo y contraseña son obligatorios'
        });

    }


    const sql = `
        SELECT id, nombre, correo, rol
        FROM usuarios
        WHERE correo = ?
        AND password = ?
    `;


    db.query(
        sql,
        [correo, password],
        (err, resultados) => {

            if (err) {

                console.error(
                    'Error en login:',
                    err
                );

                return res.status(500).json({
                    mensaje: 'Error en el servidor'
                });

            }


            if (resultados.length === 0) {

                return res.status(401).json({
                    mensaje:
                        'Correo o contraseña incorrectos'
                });

            }


            const usuario = resultados[0];


            res.json({
                mensaje:
                    'Inicio de sesión correcto',

                usuario:
                    usuario
            });

        }
    );

});


// ========================================
// LOGIN EXCLUSIVO DEL ADMINISTRADOR
// ========================================

app.post('/api/admin/login', (req, res) => {

    const {
        correo,
        password
    } = req.body;


    if (!correo || !password) {

        return res.status(400).json({
            mensaje:
                'Correo y contraseña son obligatorios'
        });

    }


    const sql = `
        SELECT
            id,
            nombre,
            correo,
            rol
        FROM usuarios
        WHERE correo = ?
        AND password = ?
        AND rol = 'admin'
    `;


    db.query(
        sql,
        [correo, password],
        (err, resultados) => {

            if (err) {

                console.error(
                    'Error en login de administrador:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error en el servidor'
                });

            }


            if (resultados.length === 0) {

                return res.status(401).json({
                    mensaje:
                        'Acceso denegado. Usuario o contraseña incorrectos.'
                });

            }


            const administrador =
                resultados[0];


            res.json({

                mensaje:
                    'Acceso de administrador correcto',

                administrador:
                    administrador

            });

        }
    );

});


// ========================================
// CREAR USUARIO
// ========================================

app.post('/api/usuarios', (req, res) => {

    const {
        nombre,
        correo,
        password,
        rol
    } = req.body;


    if (!nombre || !correo || !password) {

        return res.status(400).json({
            mensaje:
                'Nombre, correo y contraseña son obligatorios'
        });

    }


    const rolUsuario =
        rol || 'usuario';


    const sql = `
        INSERT INTO usuarios
        (nombre, correo, password, rol)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            nombre,
            correo,
            password,
            rolUsuario
        ],
        (err, resultado) => {

            if (err) {

                console.error(
                    'Error al crear usuario:',
                    err
                );


                if (err.code === 'ER_DUP_ENTRY') {

                    return res.status(400).json({
                        mensaje:
                            'Ese correo ya está registrado'
                    });

                }


                return res.status(500).json({
                    mensaje:
                        'Error al crear usuario'
                });

            }


            res.json({

                mensaje:
                    'Usuario creado correctamente',

                usuario_id:
                    resultado.insertId

            });

        }
    );

});


// ========================================
// VER USUARIOS
// ========================================

app.get('/api/usuarios', (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            correo,
            rol,
            fecha_creacion
        FROM usuarios
        ORDER BY id DESC
    `;


    db.query(
        sql,
        (err, resultados) => {

            if (err) {

                console.error(
                    'Error al consultar usuarios:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al consultar usuarios'
                });

            }


            res.json(resultados);

        }
    );

});


// ========================================
// CREAR PRODUCTO
// ========================================

app.post('/api/productos', (req, res) => {

    const {
        nombre,
        descripcion,
        precio,
        categoria,
        estado
    } = req.body;


    if (
        !nombre ||
        precio === undefined ||
        precio === ''
    ) {

        return res.status(400).json({
            mensaje:
                'Nombre y precio son obligatorios'
        });

    }


    const sql = `
        INSERT INTO productos
        (nombre, descripcion, precio, categoria, estado)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            nombre,
            descripcion || '',
            Number(precio),
            categoria || '',
            estado || 'Disponible'
        ],
        (err, resultado) => {

            if (err) {

                console.error(
                    'Error al crear producto:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al crear producto'
                });

            }


            res.json({

                mensaje:
                    'Producto creado correctamente',

                producto_id:
                    resultado.insertId

            });

        }
    );

});


// ========================================
// VER PRODUCTOS
// ========================================

app.get('/api/productos', (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            precio,
            categoria,
            estado,
            fecha_creacion
        FROM productos
        ORDER BY id DESC
    `;


    db.query(
        sql,
        (err, resultados) => {

            if (err) {

                console.error(
                    'Error al consultar productos:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al consultar productos'
                });

            }


            res.json(resultados);

        }
    );

});


// ========================================
// EDITAR PRODUCTO
// ========================================

app.put('/api/productos/:id', (req, res) => {

    const id =
        req.params.id;


    const {
        nombre,
        descripcion,
        precio,
        categoria,
        estado
    } = req.body;


    if (
        !nombre ||
        precio === undefined ||
        precio === ''
    ) {

        return res.status(400).json({
            mensaje:
                'Nombre y precio son obligatorios'
        });

    }


    const sql = `
        UPDATE productos
        SET
            nombre = ?,
            descripcion = ?,
            precio = ?,
            categoria = ?,
            estado = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            nombre,
            descripcion || '',
            Number(precio),
            categoria || '',
            estado || 'Disponible',
            id
        ],
        (err, resultado) => {

            if (err) {

                console.error(
                    'Error al editar producto:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al editar producto'
                });

            }


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Producto no encontrado'
                });

            }


            res.json({
                mensaje:
                    'Producto actualizado correctamente'
            });

        }
    );

});


// ========================================
// ELIMINAR PRODUCTO
// ========================================

app.delete('/api/productos/:id', (req, res) => {

    const id =
        req.params.id;


    const sql = `
        DELETE FROM productos
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, resultado) => {

            if (err) {

                console.error(
                    'Error al eliminar producto:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al eliminar producto'
                });

            }


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Producto no encontrado'
                });

            }


            res.json({
                mensaje:
                    'Producto eliminado correctamente'
            });

        }
    );

});


// ========================================
// GUARDAR CLIENTE Y PEDIDO
// ========================================

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


    if (
        !nombre ||
        !telefono ||
        !correo ||
        !direccion ||
        !productos ||
        !total ||
        !metodo_pago
    ) {

        return res.status(400).json({
            mensaje:
                'Faltan datos del pedido'
        });

    }


    // GUARDAR CLIENTE

    const sqlCliente = `
        INSERT INTO clientes
        (nombre, telefono, correo, direccion)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sqlCliente,
        [
            nombre,
            telefono,
            correo,
            direccion
        ],
        (err, resultadoCliente) => {

            if (err) {

                console.error(
                    'Error al guardar cliente:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al guardar el cliente'
                });

            }


            const clienteId =
                resultadoCliente.insertId;


            // GUARDAR PEDIDO

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

                        console.error(
                            'Error al guardar pedido:',
                            err
                        );

                        return res.status(500).json({
                            mensaje:
                                'Error al guardar el pedido'
                        });

                    }


                    res.json({

                        mensaje:
                            'Pedido guardado correctamente',

                        cliente_id:
                            clienteId,

                        pedido_id:
                            resultadoPedido.insertId

                    });

                }
            );

        }
    );

});


// ========================================
// VER PEDIDOS
// ========================================

app.get('/api/pedidos', (req, res) => {

    const sql = `
        SELECT
            p.id,
            p.productos,
            p.total,
            p.metodo_pago,
            p.estado,
            p.fecha,
            c.nombre,
            c.telefono,
            c.correo,
            c.direccion
        FROM pedidos p
        INNER JOIN clientes c
            ON p.cliente_id = c.id
        ORDER BY p.id DESC
    `;


    db.query(
        sql,
        (err, resultados) => {

            if (err) {

                console.error(
                    'Error al consultar pedidos:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al consultar pedidos'
                });

            }


            res.json(resultados);

        }
    );

});


// ========================================
// ACTUALIZAR ESTADO DEL PEDIDO
// ========================================

app.put('/api/pedidos/:id/estado', (req, res) => {

    const id =
        req.params.id;

    const {
        estado
    } = req.body;


    const estadosPermitidos = [
        'Pendiente',
        'Preparando',
        'Entregado',
        'Cancelado'
    ];


    if (
        !estadosPermitidos.includes(estado)
    ) {

        return res.status(400).json({
            mensaje:
                'Estado no válido'
        });

    }


    const sql = `
        UPDATE pedidos
        SET estado = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            estado,
            id
        ],
        (err, resultado) => {

            if (err) {

                console.error(
                    'Error al actualizar estado:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al actualizar estado'
                });

            }


            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({
                    mensaje:
                        'Pedido no encontrado'
                });

            }


            res.json({
                mensaje:
                    'Estado actualizado correctamente'
            });

        }
    );

});


// ========================================
// INICIAR SERVIDOR
// ========================================

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor funcionando en http://localhost:${PORT}`
        );

    }
);