const app = document.getElementById("app");
let carrito = [];

// Cargar productos desde JSON
fetch("./data/productos.json")
    .then(response => response.json())
    .then(productos => {
        mostrarProductos(productos);
    })
    .catch(error => console.error("Error al cargar los productos:", error));

// Función para mostrar productos en el catálogo
function mostrarProductos(productos) {
    productos.forEach(producto => {
        const productoCard = document.createElement("div");
        productoCard.className = "producto";

        productoCard.innerHTML = `
            <img src="./assets/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;

        app.appendChild(productoCard);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
    fetch("./data/productos.json")
        .then(response => response.json())
        .then(productos => {
            const producto = productos.find(p => p.id === idProducto);
            if (producto && producto.stock > 0) {
                const productoEnCarrito = carrito.find(item => item.id === producto.id);

                if (productoEnCarrito) {
                    productoEnCarrito.cantidad++;
                } else {
                    carrito.push({ ...producto, cantidad: 1 });
                }

                producto.stock--;
                actualizarCarrito();
            } else {
                alert("Producto agotado.");
            }
        });
}

// Actualizar el contenido del carrito
function actualizarCarrito() {
    console.clear();
    console.log("Carrito actual:", carrito);
    alert("Producto agregado al carrito. Revisa la consola para ver el carrito.");
}


// Referencias al DOM
const productosCarrito = document.getElementById("productos-carrito");
const carritoModal = document.getElementById("carrito-modal");
const verCarritoBtn = document.getElementById("ver-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");

// Mostrar el carrito
verCarritoBtn.addEventListener("click", () => {
    renderizarCarrito();
    carritoModal.classList.remove("hidden");
});

// Cerrar el carrito
cerrarCarritoBtn.addEventListener("click", () => {
    carritoModal.classList.add("hidden");
});

// Renderizar el carrito en pantalla
function renderizarCarrito() {
    productosCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        productosCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    carrito.forEach(producto => {
        const productoCarrito = document.createElement("div");
        productoCarrito.className = "producto-carrito";

        productoCarrito.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subtotal: $${producto.precio * producto.cantidad}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;

        productosCarrito.appendChild(productoCarrito);
    });

    // Total del carrito
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalCarrito = document.createElement("p");
    totalCarrito.innerHTML = `<strong>Total: $${total}</strong>`;
    productosCarrito.appendChild(totalCarrito);
}

// Eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    const index = carrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        const productoEliminado = carrito[index];
        carrito.splice(index, 1); // Eliminar producto del carrito

        // Actualizar stock
        fetch("./data/productos.json")
            .then(response => response.json())
            .then(productos => {
                const productoOriginal = productos.find(p => p.id === productoEliminado.id);
                if (productoOriginal) {
                    productoOriginal.stock += productoEliminado.cantidad;
                }
            });

        renderizarCarrito(); // Volver a renderizar el carrito
    }
}
