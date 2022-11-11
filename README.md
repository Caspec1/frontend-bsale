Tienda virtual con funcionalidades de carrito de compras, buscar por categorías, buscar por producto y paginación.

En primera instancia está realizado con módulos de JavaScript, virtual DOM y peticiones al backend realizado.

Dentro del src del proyecto y dentro de la carpeta js se encuentran 5 archivos js

En el archivo app se encuentran las peticiones al momento de cargar el documento, las cuales son los productos y las categorías, además del estado del tamaño del carrito de compras y se registran también los event listeners que tanto para la barra de menu en la versión mobile y para abrir el carrito.

En el archivo cartFunctions se encuentran todas las funcionalidades del carrito, las cuales contemplan un CRUD dentro de la inserción que se realiza en el html.

En el archivo const se encuentran todas las constantes que se utilizan en el proyecto, en este caso son los lugares donde se realizará la inyección del html a través de virtual DOM.

En el archivo createHTML se encuentran todas las inyecciones de HTML con JavaScript con virtual DOM, en donde se encuentra la inyección en el main de la aplicación, en la barra de búsqueda con las categorías y en la inyección del carrito al hacer click en este.

Por último, en el archivo getData se encuentran todas las peticiones a la base de datos las cuales son exportadas a los documentos que la requieren.