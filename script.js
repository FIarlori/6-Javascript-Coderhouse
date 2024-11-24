// Declarar carrito antes de cargar el carrito desde localStorage
let carrito = [];

// Variable para almacenar los productos cargados inicialmente
let productos = [];

// Cargar carrito desde localStorage
cargarCarritoDesdeStorage();


// Cargar productos desde JSON
fetch("./data/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data; // Guardar los productos cargados
        mostrarProductos(productos); // Mostrar productos inicialmente
    })
    .catch(error => console.error("Error al cargar los productos:", error));

// Función para mostrar productos en el catálogo
function mostrarProductos(productosParaMostrar) {
    // Limpiar el contenido anterior
    app.innerHTML = "";

    productosParaMostrar.forEach(producto => {
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
        actualizarTotalCarrito();
        guardarCarritoEnStorage();  // Guardar carrito en localStorage
    } else {
        alert("Producto agotado.");
    }
}


// Función para actualizar el carrito
function actualizarCarrito() {
    console.log("Carrito actual:", carrito);
    alert("Producto agregado al carrito.");
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

// Renderizar el carrito
// Renderizar el carrito
function renderizarCarrito() {
    productosCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        productosCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    carrito.forEach((producto) => {
        const productoCarrito = document.createElement("div");
        productoCarrito.className = "producto-carrito";

        productoCarrito.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>
                Cantidad: 
                <input 
                    type="number" 
                    value="${producto.cantidad}" 
                    min="1" 
                    max="${producto.stock}" 
                    onchange="modificarCantidad(${producto.id}, this.value)"
                    id="cantidad_${producto.id}"
                >
            </p>
            <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
            <p id="advertencia_${producto.id}" style="color: red; display: none;">No puedes seleccionar más de ${producto.stock} unidades.</p>
        `;

        productosCarrito.appendChild(productoCarrito);
    });

   // Calcular y mostrar el total del carrito
   const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
   const totalCarrito = document.createElement("p");
   totalCarrito.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
   productosCarrito.appendChild(totalCarrito);

   // Agregar el botón para vaciar el carrito
   const vaciarCarritoBtn = document.createElement("button");
   vaciarCarritoBtn.textContent = "Vaciar Carrito";
   vaciarCarritoBtn.onclick = vaciarCarrito;
   productosCarrito.appendChild(vaciarCarritoBtn);
}


// Eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    const index = carrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        const productoEliminado = carrito[index];
        carrito.splice(index, 1); // Eliminar producto del carrito

        // Actualizar stock
        const productoOriginal = productos.find(p => p.id === productoEliminado.id);
        if (productoOriginal) {
            productoOriginal.stock += productoEliminado.cantidad;
        }

        renderizarCarrito(); // Volver a renderizar el carrito
        actualizarTotalCarrito();
        guardarCarritoEnStorage();  // Guardar el carrito actualizado en localStorage
    }
}


// Actualizar el total del carrito
function actualizarTotalCarrito() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalCarritoElemento = document.getElementById("total-carrito");
    totalCarritoElemento.textContent = `Total: $${total.toFixed(2)}`;
}

// Vaciar el carrito
function vaciarCarrito() {
    carrito = []; // Vaciar el array del carrito
    renderizarCarrito(); // Actualizar la vista
    actualizarTotalCarrito(); // Llamar aquí
}


// Modificar la cantidad de productos directamente desde el carrito
function modificarCantidad(idProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find((producto) => producto.id === idProducto);
    const productoOriginal = productos.find(p => p.id === idProducto);
    
    if (productoEnCarrito && productoOriginal) {
        const stockDisponible = productoOriginal.stock;

        // Verificar si la cantidad ingresada es mayor que el stock disponible
        if (nuevaCantidad > stockDisponible) {
            // Restablecer la cantidad al stock máximo disponible
            document.getElementById(`cantidad_${idProducto}`).value = stockDisponible;

            // Mostrar el mensaje de advertencia
            const advertencia = document.getElementById(`advertencia_${idProducto}`);
            if (advertencia) {
                advertencia.style.display = "block";
            }

            // Es importante retornar para no continuar con la actualización
            setTimeout(() => {
                // Ocultar la advertencia después de 3 segundos
                if (advertencia) {
                    advertencia.style.display = "none";
                }
            }, 3000);

            return;
        } else {
            // Si la cantidad es válida, actualizar el carrito
            productoEnCarrito.cantidad = nuevaCantidad;

            // Actualizar el stock en el producto original
            productoOriginal.stock -= (nuevaCantidad - productoEnCarrito.cantidad);
        }
    }

    renderizarCarrito(); // Volver a renderizar el carrito
    actualizarTotalCarrito(); // Actualizar el total
}



// Renderizar el carrito (actualización)
function renderizarCarrito() {
    productosCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        productosCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    carrito.forEach((producto) => {
        const productoCarrito = document.createElement("div");
        productoCarrito.className = "producto-carrito";

        productoCarrito.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>
                Cantidad: 
                <input 
                    type="number" 
                    value="${producto.cantidad}" 
                    min="1" 
                    max="${producto.stock}" 
                    onchange="modificarCantidad(${producto.id}, this.value)"
                    id="cantidad_${producto.id}"
                >
            </p>
            <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
            <p id="advertencia_${producto.id}" style="color: red; display: none;">No puedes seleccionar más de ${producto.stock} unidades.</p>
        `;

        productosCarrito.appendChild(productoCarrito);
    });

    // Calcular y mostrar el total del carrito
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalCarrito = document.createElement("p");
    totalCarrito.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    productosCarrito.appendChild(totalCarrito);

    // Agregar el botón para vaciar el carrito
    const vaciarCarritoBtn = document.createElement("button");
    vaciarCarritoBtn.textContent = "Vaciar Carrito";
    vaciarCarritoBtn.onclick = vaciarCarrito;
    productosCarrito.appendChild(vaciarCarritoBtn);
}


function guardarCarritoEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Función de filtrado
document.getElementById('aplicarFiltros').addEventListener('click', () => {
    const precio = document.getElementById('filtroPrecio').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const disponibilidad = document.getElementById('filtroDisponibilidad').value;

    let productosFiltrados = productos;

    // Filtrar por precio
    if (precio === 'bajo') {
        productosFiltrados = productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (precio === 'alto') {
        productosFiltrados = productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    // Filtrar por categoría
    if (categoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria === categoria);
    }

    // Filtrar por disponibilidad
    if (disponibilidad !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto => {
            return disponibilidad === 'disponible' ? producto.stock > 0 : producto.stock === 0;
        });
    }

    mostrarProductos(productosFiltrados); // Mostrar los productos filtrados
});

// Búsqueda de productos
document.getElementById('buscarProducto').addEventListener('input', (event) => {
    const busqueda = event.target.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados); // Mostrar los productos que coinciden con la búsqueda
});
