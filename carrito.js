document.addEventListener("DOMContentLoaded", () => {
    const productosCarrito = document.getElementById("productos-carrito");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        productosCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        carrito.forEach(producto => {
            const productoCarrito = document.createElement("div");
            productoCarrito.classList.add("producto-carrito");

            productoCarrito.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
            `;
            productosCarrito.appendChild(productoCarrito);
        });

        const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        const totalCarrito = document.getElementById("total-carrito");
        totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
    }
});

// Eliminar del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(producto => producto.id !== idProducto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload(); // Recargar la página para actualizar el carrito
}
