# Documentación Tienda Pokémon

## Funcionalidades Implementadas y Operativas

### 1. Navegación y Diseño
- ✅ Header fijo con animación al hacer scroll
- ✅ Carrusel principal con imágenes y descripciones
- ✅ Carrusel de categorías con navegación
- ✅ Diseño responsivo para todos los dispositivos
- ✅ Botón de scroll to top

### 2. Búsqueda y Filtrado
- ✅ Búsqueda de Pokémon con autocompletado
- ✅ Filtrado por categorías
- ✅ Botón "Mostrar Todos" para volver a la vista general
- ✅ Paginación de resultados

### 3. Visualización de Productos
- ✅ Tarjetas de Pokémon con información detallada
- ✅ Imágenes optimizadas y efectos hover
- ✅ Precios y categorías visibles
- ✅ Botones de acción (Detalles y Agregar)

### 4. Carrito de Compras
- ✅ Drag and Drop para agregar productos
- ✅ Contador de items en el carrito
- ✅ Visualización detallada de productos en el carrito
- ✅ Control de cantidades
- ✅ Cálculo de totales
- ✅ Botón de limpiar carrito
- ✅ Animaciones y efectos visuales

### 5. Modal de Detalles
- ✅ Información detallada del Pokémon
- ✅ Control de cantidad
- ✅ Botón de agregar al carrito
- ✅ Cierre automático al agregar producto

### 6. Secciones Adicionales
- ✅ Sección de pokebolas con animaciones
- ✅ Footer con redes sociales y logo
- ✅ Diseño moderno y atractivo

## Funcionalidades No Implementadas o en Desarrollo

### 1. Sistema de Usuarios
- ❌ Registro de usuarios
- ❌ Inicio de sesión
- ❌ Perfiles de usuario
- ❌ Historial de compras
> **Razón**: No se ha implementado el backend necesario para la gestión de usuarios.

### 2. Proceso de Compra
- ❌ Checkout
- ❌ Selección de método de pago
- ❌ Dirección de envío
- ❌ Confirmación de compra
> **Razón**: Se requiere implementar la integración con pasarelas de pago y sistema de envíos.

### 3. Sistema de Favoritos
- ❌ Agregar a favoritos
- ❌ Lista de favoritos
- ❌ Notificaciones de cambios de precio
> **Razón**: No se ha implementado la persistencia de datos para favoritos.

### 4. Sistema de Reseñas
- ❌ Comentarios de usuarios
- ❌ Calificaciones
- ❌ Fotos de usuarios
> **Razón**: Se requiere implementar el backend para la gestión de reseñas.

## Estructura del Proyecto

```
PokeApi/
├── assets_Front/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
├── controllers/
│   ├── categorias.read.php
│   ├── productos.read.page.php
│   ├── productos.read.count.php
│   └── productos.readCat.php
└── index.php
```

## APIs y Endpoints Utilizados

### 1. PokeAPI
- ✅ Obtener información de Pokémon
- ✅ Obtener imágenes
- ✅ Obtener tipos y categorías

### 2. Endpoints Locales
- ✅ `/controllers/categorias.read.php`
- ✅ `/controllers/productos.read.page.php`
- ✅ `/controllers/productos.read.count.php`
- ✅ `/controllers/productos.readCat.php`

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3
- FontAwesome
- PHP
- MySQL

## Mejoras Pendientes

1. **Optimización de Rendimiento**
   - Implementar lazy loading para imágenes
   - Optimizar carga de recursos
   - Implementar caché del lado del cliente

2. **Seguridad**
   - Implementar validación de datos
   - Agregar protección CSRF
   - Implementar autenticación segura

3. **Experiencia de Usuario**
   - Agregar más animaciones
   - Mejorar feedback visual
   - Implementar modo oscuro

4. **Funcionalidades Adicionales**
   - Sistema de búsqueda avanzada
   - Filtros adicionales
   - Comparación de productos

## Notas de Mantenimiento

- El código está organizado en módulos para facilitar el mantenimiento
- Se utilizan variables CSS para consistencia en el diseño
- Los estilos están optimizados para diferentes dispositivos
- El código JavaScript está comentado para facilitar su comprensión

## Contacto y Soporte

Para reportar problemas o sugerir mejoras, por favor contactar al desarrollador:
- Email: [Tu email]
- GitHub: [Tu perfil de GitHub] 