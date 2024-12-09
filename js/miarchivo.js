// Declarar carrito antes de cargarlo desde localStorage
let carrito = [];

// Variable para almacenar los productos cargados inicialmente
let productos = [];

// Referencias al DOM
const app = document.getElementById("app");
const productosCarrito = document.getElementById("productos-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");


// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Cargar carrito desde localStorage
cargarCarritoDesdeStorage();

// Cargar productos desde JSON
fetch('../data/productos.json')
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
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="agregarAlCarrito(${producto.id})" 
                ${producto.stock <= 0 ? 'disabled' : ''}>
                ${producto.stock > 0 ? "Agregar al carrito" : "Agotado"}
            </button>
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
        guardarCarritoEnStorage();
        
        // Mostrar notificación de producto agregado al carrito
        mostrarNotificacion("El producto se ha agregado a tu carrito!");

        // Actualizar el total del carrito
        actualizarTotalCarrito();
    } else {
        alert("Producto agotado.");
    }
}

// Función para mostrar una notificación temporal
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");
    notificacion.className = "notificacion";
    notificacion.textContent = mensaje;

    // Estilo de la notificación (puedes personalizarlo con CSS)
    notificacion.style.position = "fixed";
    notificacion.style.bottom = "20px";
    notificacion.style.left = "50%";
    notificacion.style.transform = "translateX(-50%)";
    notificacion.style.backgroundColor = "#28a745";
    notificacion.style.color = "white";
    notificacion.style.padding = "10px 20px";
    notificacion.style.borderRadius = "5px";
    notificacion.style.fontSize = "16px";
    notificacion.style.zIndex = "1000";
    notificacion.style.display = "none"; // Inicialmente oculto

    document.body.appendChild(notificacion);

    // Mostrar la notificación
    notificacion.style.display = "block";

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.display = "none";
    }, 3000);
}

verCarritoBtn.addEventListener("click", () => {
    // Redirigir a la página carrito.html
    window.location.href = '../pages/carrito.html';  // Cambia a la URL de tu carrito
});


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
                    max="${producto.stock + producto.cantidad}" 
                    onchange="modificarCantidad(${producto.id}, this.value)"
                >
            </p>
            <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;

        productosCarrito.appendChild(productoCarrito);
    });

    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalCarrito = document.createElement("p");
    totalCarrito.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    productosCarrito.appendChild(totalCarrito);

    const vaciarCarritoBtn = document.createElement("button");
    vaciarCarritoBtn.textContent = "Vaciar Carrito";
    vaciarCarritoBtn.onclick = vaciarCarrito;
    productosCarrito.appendChild(vaciarCarritoBtn);
}


// Modificar la cantidad de productos directamente desde el carrito
function modificarCantidad(idProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find(producto => producto.id === idProducto);
    const productoOriginal = productos.find(p => p.id === idProducto);

    nuevaCantidad = parseInt(nuevaCantidad);

    if (productoEnCarrito && productoOriginal) {
        if (nuevaCantidad > productoOriginal.stock + productoEnCarrito.cantidad) {
            alert(`Stock insuficiente. Máximo disponible: ${productoOriginal.stock + productoEnCarrito.cantidad}`);
            return;
        }

        const diferencia = nuevaCantidad - productoEnCarrito.cantidad;
        productoEnCarrito.cantidad = nuevaCantidad;
        productoOriginal.stock -= diferencia;

        guardarCarritoEnStorage();
        renderizarCarrito();
    }
}


// Eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    const index = carrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        const productoEliminado = carrito[index];
        carrito.splice(index, 1);

        const productoOriginal = productos.find(p => p.id === productoEliminado.id);
        if (productoOriginal) {
            productoOriginal.stock += productoEliminado.cantidad;
        }

        guardarCarritoEnStorage();
        renderizarCarrito();
    }
}


// Vaciar el carrito
function vaciarCarrito() {
    carrito.forEach(producto => {
        const original = productos.find(p => p.id === producto.id);
        if (original) {
            original.stock += producto.cantidad;
        }
    });

    carrito = [];
    guardarCarritoEnStorage();
    renderizarCarrito();
}



// Filtros y búsqueda
document.getElementById('aplicarFiltros').addEventListener('click', () => {
    const precio = document.getElementById('filtroPrecio').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const disponibilidad = document.getElementById('filtroDisponibilidad').value;

    let productosFiltrados = [...productos];

    if (precio === 'bajo') productosFiltrados.sort((a, b) => a.precio - b.precio);
    else if (precio === 'alto') productosFiltrados.sort((a, b) => b.precio - a.precio);

    if (categoria !== 'todos') productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);

    if (disponibilidad === 'disponible') productosFiltrados = productosFiltrados.filter(p => p.stock > 0);
    else if (disponibilidad === 'agotado') productosFiltrados = productosFiltrados.filter(p => p.stock === 0);

    mostrarProductos(productosFiltrados);
});

document.getElementById('buscarProducto').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const resultados = productos.filter(p => p.nombre.toLowerCase().includes(query));
    mostrarProductos(resultados);
});

// Función para actualizar el carrito
function actualizarCarrito() {
    console.log("Carrito actual:", carrito);
    alert("Producto agregado al carrito.");
}





// Actualizar el total del carrito
function actualizarTotalCarrito() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalCarritoElemento = document.getElementById("total-carrito");
    if (totalCarritoElemento) {
        totalCarritoElemento.textContent = `Total: $${total.toFixed(2)}`;
    }
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



document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const menuIcon = document.getElementById('menu-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Verificar que los elementos existan antes de agregar el evento
    if (menuIcon && dropdownMenu) {
        // Agregar el evento de clic al ícono del menú
        menuIcon.addEventListener('click', function() {
            // Alternar la visibilidad del menú desplegable
            dropdownMenu.classList.toggle('show');
        });
    } else {
        console.log('Error: Los elementos no se encontraron.');
    }
});
