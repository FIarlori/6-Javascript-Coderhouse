# Proyecto de Carrito de Compras

Este es un proyecto de carrito de compras para una tienda en línea. El proyecto permite a los usuarios agregar productos al carrito, ver el contenido del carrito, modificar la cantidad de productos y realizar el pago. Además, el carrito se guarda en el `localStorage` para persistir los datos entre sesiones.

## Características

- **Catálogo de productos**: Los productos se cargan desde un archivo `productos.json` y se muestran en una página principal.
- **Agregar al carrito**: Los usuarios pueden agregar productos al carrito desde la vista del catálogo.
- **Modificar la cantidad**: Los usuarios pueden cambiar la cantidad de productos en el carrito, con validación de cantidad máxima basada en el stock disponible.
- **Eliminar productos**: Los usuarios pueden eliminar productos del carrito.
- **Total del carrito**: El total de la compra se calcula automáticamente y se actualiza cuando se realizan cambios en el carrito.
- **Persistencia**: El carrito se guarda en el `localStorage`, lo que permite que los productos en el carrito persistan entre sesiones.
- **Filtrar y ordenar productos**: Los usuarios pueden filtrar los productos por precio, categoría y disponibilidad, y ordenar los productos por precio.
- **Búsqueda de productos**: Los usuarios pueden buscar productos por nombre.

## Estructura del Proyecto

El proyecto está compuesto por los siguientes archivos:

- `index.html`: Página principal que contiene el catálogo de productos y el carrito de compras.
- `script.js`: Archivo JavaScript que contiene la lógica de funcionamiento del carrito de compras, carga de productos, manipulación del carrito y almacenamiento en `localStorage`.
- `data/productos.json`: Archivo JSON que contiene la lista de productos disponibles para la venta.
- `assets/`: Carpeta que contiene las imágenes de los productos.

## Instrucciones de Uso

### Requisitos

- Un navegador web moderno (Chrome, Firefox, etc.)

### Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu_usuario/proyecto-carrito.git
