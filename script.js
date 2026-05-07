function agregaralcarrito (){

    let carrito = document.getElementById("carrito")

    let nuevoproducto = document.createElement("li")

    nuevoproducto.textContent = "Hamburguesa de Carne - $11.000"

    carrito.appendChild(nuevoproducto)
}


function agregarDoble() {

    let carrito = document.getElementById("carrito")

    let nuevoProducto = document.createElement("li")

    nuevoProducto.textContent = "Hamburguesa Doble Carne - $15.000"

    carrito.appendChild(nuevoProducto)

}

function agregatercera () {

    let carrito = document.getElementById("carrito")

    let nuevoProducto = document.createElement("li")

    nuevoProducto.textContent = "AMBURGUESA DE CERDO - $ 12000"

    carrito.appendChild(nuevoProducto)
}

function agrecuarta (){

    let carrito = document.getElementById("carrito")

    let nuevoProducto = document.createElement("li")

    nuevoProducto.textContent = "AMBURGUESA DE POLLO - $12000"

    carrito.appendChild(nuevoProducto)
}

