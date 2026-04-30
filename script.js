function obtenerValores() {
    let a = Number(document.getElementById("num1").value)
    let b = Number(document.getElementById("num2").value)
    return { a, b }
}

function mostrarResultado(res) {
    document.getElementById("resultado").textContent = "Resultado: " + res
}

function sumar() {
    let { a, b } = obtenerValores()
    mostrarResultado(a + b)
}

function restar() {
    let { a, b } = obtenerValores()
    mostrarResultado(a - b)
}

function multiplicar() {
    let { a, b } = obtenerValores()
    mostrarResultado(a * b)
}

function dividir() {
    let { a, b } = obtenerValores()
    if (b === 0) {
        mostrarResultado("No se puede dividir entre 0")
    } else {
        mostrarResultado(a / b)
    }
}