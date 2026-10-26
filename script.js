let total = 0;


// ========================================
// AGREGAR PRODUCTO AL CARRITO
// ========================================

function agregarAlCarrito(nombre, precio) {

    let carrito = document.getElementById("carrito");

    let item = document.createElement("li");

    item.innerHTML = `
        ${nombre} - $${Number(precio).toLocaleString()}
        <button onclick="eliminarProducto(this, ${precio})">
            ❌
        </button>
    `;

    carrito.appendChild(item);

    total += Number(precio);

    actualizarTotal();
}



// ========================================
// ELIMINAR PRODUCTO
// ========================================

function eliminarProducto(boton, precio) {

    let item = boton.parentElement;

    item.remove();

    total -= Number(precio);

    actualizarTotal();
}



// ========================================
// ACTUALIZAR TOTAL
// ========================================

function actualizarTotal() {

    let totalElemento = document.getElementById("total");

    if (totalElemento) {

        totalElemento.textContent =
            "Total: $" + total.toLocaleString();
    }
}



// ========================================
// ABRIR MODAL DE PAGO
// ========================================

function pagar() {

    if (total <= 0) {

        alert("🛒 Primero debes agregar productos al carrito.");

        return;
    }

    document.getElementById("modalPago").style.display = "flex";
}



// ========================================
// CERRAR MODAL
// ========================================

function cerrarModal() {

    document.getElementById("modalPago").style.display = "none";
}



// ========================================
// CONFIRMAR PEDIDO
// ========================================

async function confirmarPago() {

    // Obtener datos del cliente

    const nombre =
        document.getElementById("nombreCliente").value.trim();

    const telefono =
        document.getElementById("telefonoCliente").value.trim();

    const correo =
        document.getElementById("correoCliente").value.trim();

    const direccion =
        document.getElementById("direccionCliente").value.trim();

    const metodoPago =
        document.getElementById("metodoPago").value;



    // ========================================
    // VALIDAR DATOS
    // ========================================

    if (!nombre) {

        alert("⚠️ Escribe tu nombre.");

        return;
    }

    if (!telefono) {

        alert("⚠️ Escribe tu teléfono.");

        return;
    }

    if (!correo) {

        alert("⚠️ Escribe tu correo.");

        return;
    }

    if (!direccion) {

        alert("⚠️ Escribe tu dirección.");

        return;
    }

    if (!metodoPago) {

        alert("⚠️ Selecciona un método de pago.");

        return;
    }



    // ========================================
    // OBTENER PRODUCTOS DEL CARRITO
    // ========================================

    const elementos =
        document.querySelectorAll("#carrito li");

    let productos = [];

    elementos.forEach((elemento) => {

        // Copiamos solamente el texto
        // quitando el botón ❌

        const texto =
            elemento.firstChild.textContent.trim();

        productos.push(texto);

    });



    // ========================================
    // ENVIAR INFORMACIÓN A NODE.JS
    // ========================================

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/pedidos",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: nombre,

                    telefono: telefono,

                    correo: correo,

                    direccion: direccion,

                    productos: productos,

                    total: total,

                    metodo_pago: metodoPago

                })
            }
        );



        const datos =
            await respuesta.json();



        // ========================================
        // RESPUESTA DEL SERVIDOR
        // ========================================

        if (!respuesta.ok) {

            alert(
                "❌ " +
                (datos.mensaje || "No se pudo guardar el pedido.")
            );

            return;
        }



        alert(
            "✅ ¡Pedido realizado correctamente!\n\n" +
            "Cliente: " + nombre + "\n" +
            "Total: $" + total.toLocaleString() + "\n" +
            "Pago: " + metodoPago
        );



        // ========================================
        // LIMPIAR CARRITO
        // ========================================

        document.getElementById("carrito").innerHTML = "";

        total = 0;

        actualizarTotal();



        // Limpiar formulario

        document.getElementById("nombreCliente").value = "";

        document.getElementById("telefonoCliente").value = "";

        document.getElementById("correoCliente").value = "";

        document.getElementById("direccionCliente").value = "";

        document.getElementById("metodoPago").value = "";



        cerrarModal();


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        alert(
            "❌ No se pudo conectar con el servidor Node.js."
        );
    }
}


