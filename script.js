let total = 0;

function agregarAlCarrito(nombre, precio) {

    let carrito = document.getElementById("carrito");

    let item = document.createElement("li");

    // Creamos texto + botón de borrar
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

function eliminarProducto(boton, precio) {

    let item = boton.parentElement;
    item.remove();

    total -= Number(precio);

    actualizarTotal();
}

function actualizarTotal() {

    let totalElemento = document.getElementById("total");

    if (totalElemento) {
        totalElemento.textContent = "Total: $" + total.toLocaleString();
    }
}

function pagar() {

    let metodo = prompt("💳 Elige:\n1. Nequi\n2. Efectivo");

    if (metodo == "1") {
        alert("🟣 Pagas con Nequi");
    } 
    else if (metodo == "2") {
        alert("💵 Pagas en efectivo");
    } 
    else {
        alert("❌ Opción inválida");
        return;
    }

    alert("✅ Pedido realizado con éxito");

    document.getElementById("carrito").innerHTML = "";
    total = 0;

    actualizarTotal();
}

function pagar() {
    document.getElementById("modalPago").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalPago").style.display = "none";
}

function confirmarPago(metodo) {

    alert("✅ Pagaste con " + metodo);

    document.getElementById("carrito").innerHTML = "";
    total = 0;

    document.getElementById("total").textContent = "Total: $0";

    cerrarModal();
}



