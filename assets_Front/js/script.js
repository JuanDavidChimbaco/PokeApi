/**
 * Variables Globales
 * -----------------
 */
let p = []; // Array para almacenar los productos del carrito
let productosCarrito = []; // Array para almacenar los productos del carrito en formato específico

const CONFIG = {
    API_BASE_URL: "https://pokeapi.co/api/v2/", // URL base de la API 
    CACHE_DURATION: 5 * 60 * 1000, // Duración de la caché en milisegundos  
    POKEMONS_PER_PAGE: 8, // Número de Pokémon por página
    SCROLL_THRESHOLD: 50 // Umbral de scroll para ocultar el header
};

/**
 * Funciones de Drag and Drop
 * -------------------------
 * Estas funciones manejan la funcionalidad de arrastrar y soltar Pokémon al carrito.
 */

/**
 * Permite el evento de soltar en el área del carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const dropZone = ev.currentTarget;
    dropZone.classList.add('drag-over');
}

/**
 * Maneja el evento cuando un elemento entra en el área del carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function handleDragEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const dropZone = ev.currentTarget;
    dropZone.classList.add('drag-over');
}

/**
 * Maneja el evento cuando un elemento sale del área del carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function handleDragLeave(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const dropZone = ev.currentTarget;
    dropZone.classList.remove('drag-over');
}

/**
 * Inicia el arrastre de un Pokémon
 * @param {DragEvent} ev - Evento de arrastre
 */
function drag(ev) {
    const target = ev.target.closest('.pokemon-card');
    if (!target) return;

    const pokemonId = target.getAttribute('data-pokemon-id');
    if (!pokemonId) return;

    ev.dataTransfer.setData('pokemonId', pokemonId);
    target.classList.add('dragging');

    // Agregar efecto visual al arrastrar
    ev.dataTransfer.effectAllowed = 'move';
}

/**
 * Maneja el evento cuando se suelta un Pokémon en el carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const dropZone = ev.currentTarget;
    dropZone.classList.remove('drag-over');

    const pokemonId = ev.dataTransfer.getData('pokemonId');
    if (pokemonId) {
        addCart(parseInt(pokemonId));
    }
}

/**
 * Carrusel
 * -------
 * Funciones relacionadas con el carrusel de categorías
 */

/**
 * Inicializa el carrusel de categorías con múltiples elementos por slide
 */
function carrusel() {
    const myCarousel = document.querySelectorAll('#featureContainer .carousel .carousel-item');
    const minPerSlide = 4;

    myCarousel.forEach((el) => {
        let next = el.nextElementSibling;
        let itemsToAdd = [];

        for (let i = 1; i < minPerSlide; i++) {
            if (!next) {
                next = myCarousel[0];
            }
            itemsToAdd.push(next);
            next = next.nextElementSibling;
        }

        itemsToAdd.forEach((item) => {
            const cloneChild = item.cloneNode(true);
            el.appendChild(cloneChild.children[0]);
        });
    });
}

/**
 * Búsqueda y Autocompletado
 * ------------------------
 */

/**
 * Realiza la búsqueda de Pokémon con autocompletado y muestra los resultados en una lista de búsqueda 
 * @returns {Promise<void>}
 */
async function autoCompletePokemon() {
    const searchInput = document.getElementById("txtBuscar");
    const searchText = searchInput.value.toLowerCase();
    const listaPokemon = document.getElementById("listaPokemon");

    if (searchText.length < 2) {
        listaPokemon.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        if (!response.ok) throw new Error('Error en la búsqueda');

        const data = await response.json();
        const filteredPokemon = data.results.filter(pokemon =>
            pokemon.name.includes(searchText)
        );

        if (filteredPokemon.length === 0) {
            listaPokemon.innerHTML = "<div class='list-group-item'>No se encontraron resultados</div>";
            return;
        }

        // Obtener los datos completos de los Pokémon filtrados
        const pokemonData = await fetchPokemonData(filteredPokemon);

        const lista = pokemonData.map(({ data_pokemon }) => `
            <div onclick="getDetallePokemon('${data_pokemon.id}')"
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                class='list-group-item list-group-item-action' 
                style="cursor: pointer;">
                ${data_pokemon.name} 
                <img src="${data_pokemon.sprites.other["official-artwork"].front_default}" 
                     class="pokemon-icon" 
                     alt="${data_pokemon.name}"
                     onerror="this.src='assets_Front/img/unknown.png'">
            </div>
        `).join('');

        listaPokemon.innerHTML = `<div class='list-group'>${lista}</div>`;
        listaPokemon.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            z-index: 2000;
            max-height: 400px;
            overflow: auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        listaPokemon.innerHTML = "<div class='list-group-item text-danger'>Error al buscar Pokémon</div>";
    }
}


/**
 * Gestión de Categorías 
 * --------------------
 */

/**
 * Obtiene las categorías de Pokémon desde el servidor 
 * @returns {Promise<Array>} Array de categorías
 */
async function getPokemonCategories() {
    if (window._pokemonCategoriesCache?.timestamp &&
        (Date.now() - window._pokemonCategoriesCache.timestamp < CONFIG.CACHE_DURATION)) {
        return window._pokemonCategoriesCache.data;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/type/`);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        window._pokemonCategoriesCache = {
            data: data.results,
            timestamp: Date.now()
        };

        return data.results;
    } catch (error) {
        console.error("Error al obtener categorías de Pokémon:", error);
        throw error;
    }
}

/**
 * Imprime las categorías en el carrusel y en el menú desplegable 
 * Muestra 5 cards en desktop y 2 en móvil, sin duplicar ni clonar elementos.
 * No usa flechas de navegación.
 * @returns {Promise<void>}
 */
async function printCategories() {
    try {
        const categorias = await getPokemonCategories();
        // Agrupar las categorías en slides de 5 (desktop) o 2 (móvil)
        const itemsPerSlideDesktop = 5;
        const itemsPerSlideMobile = 2;
        let carouselItems = '';
        for (let i = 0; i < categorias.length; i += itemsPerSlideDesktop) {
            const group = categorias.slice(i, i + itemsPerSlideDesktop);
            carouselItems += `
                <div class="carousel-item${i === 0 ? ' active' : ''}">
                    <div class="row row-cols-2 row-cols-md-5 g-2 justify-content-center align-items-center">
                        ${group.map(element => `
                            <div class="col d-flex justify-content-center">
                                <div class="categoria-card">
                                    <a class="text-center" onclick="SaveUrlCategory('${element.url}')" href="#pokemon-container">
                                        <img src="${imagenC(element.name)}" class="categoria-img" alt="${element.name}">
                                        <div class="categoria-title">${element.name}</div>
                                    </a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        document.getElementById("carouselCategorias").innerHTML = carouselItems;
        // No se necesita carrusel() ni flechas
    } catch (error) {
        console.error("Error al imprimir categorías:", error);
        throw error;
    }
}

/**
 * Guarda la url de la categoria en el LocalStorage
 * @param {string} url - URL de la categoría
 */
function SaveUrlCategory(url) {
    localStorage.setItem("categoria_url", url);
    currentPage = 1; // Resetear la página actual a 1
    loadPokemonByCategory(); // Cargar los Pokémon de la categoría seleccionada
}

/**
 * Carga los Pokémon según la categoría seleccionada
 * 
 * Esta función asíncrona obtiene y muestra los Pokémon filtrados por categoría.
 * Si no hay categoría seleccionada, muestra todos los Pokémon.
 * 
 * El proceso incluye:
 * 1. Verificar si hay una categoría seleccionada en localStorage
 * 2. Si no hay categoría, mostrar todos los Pokémon
 * 3. Si hay categoría, obtener los Pokémon de esa categoría
 * 4. Si no hay Pokémon en la categoría, mostrar un mensaje y todos los Pokémon
 * 5. Mostrar los Pokémon en tarjetas con el mismo formato que getPokemon()
 * 
 * @returns {Promise<void>} No retorna valor, pero actualiza el DOM con los Pokémon
 * @throws {Error} Propaga cualquier error que ocurra durante la obtención de datos
 */
async function loadPokemonByCategory() {
    try {
        let urlCategory = localStorage.getItem("categoria_url");
        if (!urlCategory) {
            getAllPokemon();
            document.getElementById('btn-mostrar-todos').classList.add('d-none');
            document.getElementById('categoria-actual').textContent = 'Todos los Pokémon';
            return;
        }

        // Mostrar spinner de carga
        document.getElementById('pokemon-container').innerHTML = `
            <div class="pokemon-grid-loading">
                <div class="pokeball-spinner">
                    <div class="pokeball-top"></div>
                    <div class="pokeball-center"></div>
                    <div class="pokeball-bottom"></div>
                </div>
                <p class="loading-text">Cargando Pokémon...</p>
            </div>`;

        const response = await fetch(urlCategory);
        const data = await response.json();
        const pokemonByType = data.pokemon;

        if (pokemonByType.length === 0) {
            Swal.fire({
                title: '¡Ups!',
                text: 'No hay Pokémon disponibles en esta categoría por el momento.',
                icon: 'info',
                confirmButtonText: 'Ver todos los Pokémon',
                confirmButtonColor: '#2a75bb',
                background: '#fff',
                customClass: {
                    title: 'pokemon-title',
                    content: 'pokemon-text'
                }
            }).then(() => {
                getAllPokemon();
                document.getElementById('btn-mostrar-todos').classList.add('d-none');
                document.getElementById('categoria-actual').textContent = 'Todos los Pokémon';
            });
            return;
        }

        document.getElementById('btn-mostrar-todos').classList.remove('d-none');
        document.getElementById('categoria-actual').textContent = `Categoría: ${data.name}`;

        const startIndex = (currentPage - 1) * pokemonsPerPage;
        const endIndex = startIndex + pokemonsPerPage;
        const pokemonToShow = pokemonByType.slice(startIndex, endIndex);

        let cardContent = "";
        let rowContent = "";

        const pokemonData = await fetchPokemonData(pokemonToShow);

        pokemonData.forEach((element, index) => {
            if (index % 4 === 0) {
                rowContent += "<div class='row g-2'>";
            }
            const types = element.data_pokemon.types.map(type => type.type.name).join(' / ');
            const hp = element.data_pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
            
            const card = `
            <div class="col-md-3">
              <div class="card h-100 pokemon-card" 
                   draggable="true" 
                   ondragstart="drag(event)" 
                   data-pokemon-id="${element.data_pokemon.id}">
                <div class="card-img-container">
                  <img src="${element.data_pokemon.sprites.other["official-artwork"].front_default}" class="card-img-top pokemon-img" alt="${element.data_pokemon.name}">
                </div>
                <div class="card-body p-2">
                  <h6 class="card-title mb-1">${element.data_pokemon.name}</h6>
                  <p class="card-text mb-1"><small class="text-muted">${types}</small></p>
                  <p class="card-text mb-2 fw-bold">${element.data_pokemon.weight} kg</p>
                  <p class="card-text mb-2 text-success">Stock: ${hp}</p>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary flex-grow-1" 
                            onclick="getDetallePokemon('${element.data_pokemon.id}')" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal">
                      <i class="fas fa-info-circle"></i> Detalles
                    </button>
                    <button class="btn btn-sm btn-primary flex-grow-1" 
                            onclick="addCart(${element.data_pokemon.id})">
                      <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
              </div>
            </div>
          </div>
        `;
            rowContent += card;

            if ((index + 1) % 4 === 0 || index === pokemonData.length - 1) {
                rowContent += "</div>";
                cardContent += rowContent;
                rowContent = "";
            }
        });

        document.getElementById('pokemon-container').innerHTML = cardContent;
        createPagination(pokemonByType.length);
        document.getElementById('pokemon-container').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar Pokémon por categoría:', error);
        document.getElementById('pokemon-container').innerHTML = 
            '<div class="alert alert-danger">Error al cargar los Pokémon. Por favor, intente nuevamente.</div>';
    }
}

/**
 * Obtiene el color del tipo de Pokémon
 * @param {string} type - Tipo de Pokémon
 * @returns {string} Color del tipo de Pokémon
 */
function getTypeColor(type) {
    const typeColors = {
        'normal': 'secondary',
        'fighting': 'danger',
        'flying': 'info',
        'poison': 'purple',
        'ground': 'warning',
        'rock': 'secondary',
        'bug': 'success',
        'ghost': 'dark',
        'steel': 'secondary',
        'fire': 'danger',
        'water': 'primary',
        'grass': 'success',
        'electric': 'warning',
        'psychic': 'purple',
        'ice': 'info',
        'dragon': 'primary',
        'dark': 'dark',
        'fairy': 'pink'
    };
    return typeColors[type.toLowerCase()] || 'primary';
}

/**
 * Obtiene la imagen de la categoría de un Pokémon
 * @param {string} name - Nombre del Pokémon
 * @returns {string} URL de la imagen del Pokémon
 */
function imagenC(name) {
    const imageMap = {
        normal: "assets_Front/img/normal.png",
        fighting: "assets_Front/img/fighting.png",
        flying: "assets_Front/img/flying.png",
        poison: "assets_Front/img/Poison.png",
        ground: "assets_Front/img/ground.png",
        rock: "assets_Front/img/rock.png",
        bug: "assets_Front/img/bug.png",
        ghost: "assets_Front/img/ghost.png",
        steel: "assets_Front/img/steel.png",
        fire: "assets_Front/img/fire.png",
        water: "assets_Front/img/water.png",
        grass: "assets_Front/img/grass.png",
        electric: "assets_Front/img/electric.png",
        psychic: "assets_Front/img/psychic.png",
        ice: "assets_Front/img/ice.png",
        dragon: "assets_Front/img/dragon.png",
        dark: "assets_Front/img/dark.png",
        fairy: "assets_Front/img/fairy.png",
        unknown: "assets_Front/img/unknown.png",
        shadow: "assets_Front/img/unknown.png",
        stellar: "assets_Front/img/stellar.png",
    };
    return imageMap[name];
}

/**
 * Gestión del Carrito
 * -----------------
 */


/**
 * Agrega un Pokémon al carrito
 * @param {number} elemento - ID del Pokémon
 * @returns {Promise<void>}
 */
async function addCart(id) {
    // Siempre usar cantidad 1 cuando se agrega desde la tarjeta
    const cantidad = 1;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/pokemon/${id}`);
        const data = await response.json();

        // Calcular precio basado en el peso del Pokémon (1kg = $1000)
        const precioBase = Math.round(data.weight * 100);
        data.precioPokemon = precioBase;

        // Simular stock usando el HP
        const hp = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
        data.cantidadPokemon = hp;

        const index = p.findIndex(producto => producto.id === data.id);
        if (index !== -1) {
            const nuevaCantidad = p[index].cantidad + cantidad;
            if (nuevaCantidad <= data.cantidadPokemon) {
                p[index].cantidad = nuevaCantidad;
            } else {
                p[index].cantidad = data.cantidadPokemon;
                Swal.fire({
                    title: '¡Atención!',
                    text: 'Se ha alcanzado el límite de unidades disponibles',
                    icon: 'warning',
                    confirmButtonColor: '#2a75bb'
                });
            }
        } else {
            if (cantidad <= data.cantidadPokemon) {
                data.cantidad = cantidad;
                p.push(data);
            } else {
                data.cantidad = data.cantidadPokemon;
                p.push(data);
                Swal.fire({
                    title: '¡Atención!',
                    text: 'Se ha ajustado la cantidad al máximo disponible',
                    icon: 'warning',
                    confirmButtonColor: '#2a75bb'
                });
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        if (modal) {
            modal.hide();
        }

        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
        offcanvas.show();

        pintarCarrito();

        // Mostrar confirmación de agregado al carrito
        Swal.fire({
            title: '¡Agregado!',
            text: `${data.name} ha sido agregado al carrito`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });

        guardarCarrito();

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        Swal.fire({
            title: '¡Error!',
            text: 'Hubo un problema al agregar el Pokémon al carrito',
            icon: 'error',
            confirmButtonColor: '#2a75bb'
        });
    }
}

/**
 * Pinta el contenido del carrito
 */
function pintarCarrito() {
    // Simplificando variables locales
    const contenidoCarrito = document.getElementById('contenidoCarrito');
    const totalElement = document.getElementById('total');
    const carritoNumero = document.getElementById("carrito-numero");

    // Verificar si el carrito está vacío
    if (!p || p.length === 0) {
        contenidoCarrito.innerHTML = '<div class="text-center p-3">El carrito está vacío</div>';
        totalElement.innerHTML = "$0";
        carritoNumero.innerText = "0";
        carritoNumero.style.display = "none";
        return;
    }

    let total = 0;
    productosCarrito = p.map(producto => {
        if (!producto) return null;

        const precio = producto.precioPokemon * producto.cantidad;
        total += precio;

        return {
            id: producto.id,
            nombre: producto.name,
            precio: producto.precioPokemon,
            cantidad: producto.cantidad,
            stock: producto.cantidadPokemon,
            imagen: producto.sprites.other["official-artwork"].front_default,
            total: precio
        };
    }).filter(Boolean);

    // Generar el HTML del carrito
    const card = productosCarrito.map(producto => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="cart-item-details">
                <h6 class="cart-item-title">${producto.nombre}</h6>
                <div class="cart-item-info">
                    <span class="cart-item-price">$${producto.precio}</span>
                    <span class="cart-item-stock">Stock: ${producto.stock}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="btn-quantity" onclick="actualizarCantidad(${producto.id}, ${producto.cantidad - 1})">-</button>
                        <input type="number" class="form-control" min="1" max="${producto.stock}" 
                               value="${producto.cantidad}" onchange="actualizarCantidad(${producto.id}, this.value)">
                        <button class="btn-quantity" onclick="actualizarCantidad(${producto.id}, ${producto.cantidad + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        <span>Total: $${producto.total}</span>
                    </div>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito(${producto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    contenidoCarrito.innerHTML = card;
    totalElement.innerHTML = `$${total}`;
    carritoNumero.innerText = p.length.toString();
    carritoNumero.style.display = p.length > 0 ? "block" : "none";
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} id - ID del producto
 * @param {number} nuevaCantidad - Nueva cantidad
 */
function actualizarCantidad(id, newQuantity) {
    const producto = p.find(p => p.id === id);
    if (!producto) return;

    newQuantity = parseInt(newQuantity);
    if (newQuantity >= 1 && newQuantity <= producto.cantidadPokemon) {
        producto.cantidad = newQuantity;
        pintarCarrito();
        guardarCarrito();
    } else if (newQuantity > producto.cantidadPokemon) {
        producto.cantidad = producto.cantidadPokemon;
        Swal.fire({
            title: '¡Atención!',
            text: 'Se ha alcanzado el límite de unidades disponibles',
            icon: 'warning',
            confirmButtonColor: '#2a75bb'
        });
        pintarCarrito();
        guardarCarrito();
    }
}

/**
 * Elimina un producto del carrito
 * @param {number} id - ID del producto a eliminar
 */
function eliminarDelCarrito(id) {
    p = p.filter(producto => producto.id !== id);
    pintarCarrito();
    guardarCarrito();

    if (p.length === 0) {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
        if (offcanvas) {
            offcanvas.hide();
        }
    }
}

/**
 * Limpia el carrito
 */
function limpiarCarrito() {
    if (p.length === 0) {
        Swal.fire({
            title: '¡Ups!',
            text: 'El carrito ya está vacío',
            icon: 'info',
            confirmButtonColor: '#2a75bb'
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, limpiar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            p = [];
            document.getElementById('contenidoCarrito').innerHTML = "";
            document.getElementById('total').innerHTML = "";
            pintarCarrito();
            guardarCarrito();

            const cantidadInput = document.getElementById('cantidadDetalle');
            if (cantidadInput) {
                cantidadInput.value = 1;
            }

            Swal.fire({
                title: '¡Listo!',
                text: 'El carrito ha sido limpiado',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}


/**
 *  Gestion de Detalles de Pokémon 
 * ------------------------------
*/

/**
 * Obtiene y muestra los detalles de un Pokémon
 * @param {string|number} id - ID del Pokémon
 * @returns {Promise<void>}
 */
async function getDetallePokemon(id) {
    try {
        // Mostrar un indicador de carga
        const detallePokemon = document.getElementById("detallePokemon");
        detallePokemon.innerHTML = `
            <div class="pokemon-loading">
                <div class="pokeball-spinner">
                    <div class="pokeball-top"></div>
                    <div class="pokeball-center"></div>
                    <div class="pokeball-bottom"></div>
                </div>
                <p class="loading-text">Cargando Pokémon...</p>
            </div>`;

        // Agregar estilos para el spinner
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            .pokemon-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            .pokeball-spinner {
                width: 60px;
                height: 60px;
                position: relative;
                animation: spin 1s linear infinite;
            }
            .pokeball-top {
                position: absolute;
                width: 100%;
                height: 50%;
                background: #ff1a1a;
                border-radius: 30px 30px 0 0;
                border: 3px solid #000;
                border-bottom: none;
            }
            .pokeball-bottom {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 50%;
                background: #fff;
                border-radius: 0 0 30px 30px;
                border: 3px solid #000;
                border-top: none;
            }
            .pokeball-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                background: #fff;
                border: 3px solid #000;
                border-radius: 50%;
                z-index: 1;
            }
            .pokeball-center::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background: #000;
                border-radius: 50%;
            }
            .loading-text {
                margin-top: 1rem;
                font-size: 1.2rem;
                color: #2a75bb;
                font-weight: 500;
            }
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(loadingStyle);

        // Obtener datos del Pokémon
        const response = await fetch(`${CONFIG.API_BASE_URL}/pokemon/${id}`);
        if (!response.ok) throw new Error('Error al obtener los datos del Pokémon');
        
        const data = await response.json();

        // Preparar los datos para mostrar
        const types = data.types.map(type => ({
            name: type.type.name,
            color: getTypeColor(type.type.name)
        }));

        const stats = data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat,
            percentage: (stat.base_stat / 255) * 100
        }));

        const abilities = data.abilities.map(ability => ability.ability.name);

        // Generar el HTML con los detalles
        detallePokemon.innerHTML = `
            <div class="pokemon-detail-container">
                <div class="row">
                    <!-- Imagen del Pokémon -->
                    <div class="col-lg-5 pokemon-detail-image">
                        <div class="image-container">
                            <img src="${data.sprites.other["official-artwork"].front_default}" 
                                 class="pokemon-img" 
                                 alt="${data.name}"
                                 onerror="this.src='assets_Front/img/unknown.png'">
                        </div>
                        <div class="pokemon-types mt-3">
                            ${types.map(type => `
                                <span class="badge bg-${type.color} me-1">${type.name}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Información del Pokémon -->
                    <div class="col-lg-7 pokemon-detail-info">
                        <div class="pokemon-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <h3 class="pokemon-name text-capitalize mb-0">${data.name}</h3>
                                <div class="pokemon-id">#${String(data.id).padStart(3, '0')}</div>
                            </div>
                        </div>
                        
                        <div class="pokemon-stats mt-4">
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="stat-item">
                                        <i class="fas fa-weight"></i>
                                        <span class="stat-label">Peso:</span>
                                        <span class="stat-value">${data.weight / 10} kg</span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-item">
                                        <i class="fas fa-ruler-vertical"></i>
                                        <span class="stat-label">Altura:</span>
                                        <span class="stat-value">${data.height / 10} m</span>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-item mt-3">
                                <i class="fas fa-star"></i>
                                <span class="stat-label">Habilidades:</span>
                                <span class="stat-value">${abilities.join(', ')}</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-box"></i>
                                <span class="stat-label">Stock:</span>
                                <span class="stat-value">${data.stats.find(stat => stat.stat.name === 'hp').base_stat}</span>
                            </div>
                        </div>

                        <!-- Estadísticas base -->
                        <div class="pokemon-base-stats mt-4">
                            <h5 class="mb-3">Estadísticas Base</h5>
                            ${stats.map(stat => `
                                <div class="stat-bar mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="stat-name text-capitalize">${stat.name}</span>
                                        <span class="stat-value">${stat.value}</span>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar bg-${getTypeColor(types[0].name)}" 
                                             role="progressbar" 
                                             style="width: ${stat.percentage}%"
                                             aria-valuenow="${stat.value}" 
                                             aria-valuemin="0" 
                                             aria-valuemax="255">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="pokemon-actions mt-4">
                            <div class="d-flex gap-2">
                                <div class="input-group" style="width: auto;">
                                    <span class="input-group-text">Cantidad</span>
                                    <input type="number" 
                                           class="form-control" 
                                           min="1" 
                                           max="99" 
                                           value="1" 
                                           id="cantidadDetalle">
                                </div>
                                <button class="btn btn-primary flex-grow-1" 
                                        onclick="addCart(${data.id})">
                                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        // Agregar estilos dinámicos para mejorar la presentación
        const style = document.createElement('style');
        style.textContent = `
            .pokemon-detail-container {
                max-width: 100%;
                margin: 0 auto;
            }
            .pokemon-detail-image{
                flex-direction: column;
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error('Error al cargar detalles del Pokémon:', error);
        document.getElementById("detallePokemon").innerHTML = `
            <div class="alert alert-danger m-3">
                <i class="fas fa-exclamation-circle"></i>
                Error al cargar los detalles del Pokémon. Por favor, intente nuevamente.
            </div>`;
    }
}


/**
 *  Gestion de Pokémon en la página principal
 *  ----------------------------------------
*/

const pokemonsPerPage = 8;
let currentPage = 1;

/**
 * Obtiene todos los Pokémon y muestra una lista de ellos en la página
 * @returns {Promise<void>}
 */
async function getAllPokemon() {
    try {
        // Mostrar spinner de carga
        document.getElementById('pokemon-container').innerHTML = `
            <div class="pokemon-grid-loading">
                <div class="pokeball-spinner">
                    <div class="pokeball-top"></div>
                    <div class="pokeball-center"></div>
                    <div class="pokeball-bottom"></div>
                </div>
                <p class="loading-text">Cargando Pokémon...</p>
            </div>`;

        const offset = (currentPage - 1) * pokemonsPerPage;
        const limit = pokemonsPerPage;
        const response = await fetch(`${CONFIG.API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        let cardContent = "";
        let rowContent = "";

        const pokemonData = await fetchPokemonData(data.results);

        pokemonData.forEach(({ data_pokemon, index }) => {
            if (index % 4 === 0) {
                rowContent += "<div class='row g-2'>";
            }

            const types = data_pokemon.types.map(type => type.type.name).join(' / ');
            const hp = data_pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
            
            const card = `
                <div class="col-md-3">
                <div class="card h-100 pokemon-card" 
                    draggable="true" 
                    ondragstart="drag(event)" 
                    data-pokemon-id="${data_pokemon.id}">
                    <div class="card-img-container">
                    <img src="${data_pokemon.sprites.other["official-artwork"].front_default}" 
                         class="card-img-top pokemon-img" 
                         alt="${data_pokemon.name}"
                         onerror="this.src='assets_Front/img/unknown.png'">
                    </div>
                    <div class="card-body p-2">
                    <h6 class="card-title mb-1 text-capitalize">${data_pokemon.name}</h6>
                    <p class="card-text mb-1"><small class="text-muted">${types}</small></p> 
                    <p class="card-text mb-2 fw-bold">${data_pokemon.weight} kg</p>
                    <p class="card-text mb-2 text-success">Stock: ${hp}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-grow-1" 
                                onclick="getDetallePokemon('${data_pokemon.id}')" 
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModal">
                        <i class="fas fa-info-circle"></i> Detalles
                        </button>
                        <button class="btn btn-sm btn-primary flex-grow-1" 
                                onclick="addCart(${data_pokemon.id})">
                        <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            `;

            rowContent += card;

            if ((index + 1) % 4 === 0 || index === pokemonData.length - 1) {
                rowContent += "</div>";
                cardContent += rowContent;
                rowContent = "";
            }
        });

        document.getElementById('pokemon-container').innerHTML = cardContent;
        createPagination(data.count);
    } catch (error) {
        console.error('Error al cargar los Pokémon:', error);
        document.getElementById('pokemon-container').innerHTML = 
            '<div class="alert alert-danger">Error al cargar los Pokémon. Por favor, intente nuevamente.</div>';
    }
}

/**
 * Crea y renderiza la paginación para la lista de Pokémon
 * 
 * Esta función genera una barra de paginación que permite navegar entre las diferentes
 * páginas de Pokémon. La paginación incluye botones "Previous" y "Next", así como
 * números de página individuales.
 * 
 * El proceso incluye:
 * 1. Calcular el número total de páginas basado en el total de Pokémon
 * 2. Crear una lista de paginación con botones de navegación
 * 3. Agregar eventos click a cada botón de página
 * 4. Manejar estados deshabilitados para los botones Previous/Next
 * 5. Actualizar la vista cuando se cambia de página
 * 
 * @param {number} totalPokemons - El número total de Pokémon disponibles
 * @returns {void} No retorna valor, pero actualiza el DOM con la paginación
 */

function createPagination(totalPokemons) {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalPokemons / pokemonsPerPage);

    // Número de páginas a mostrar antes y después de la página actual
    const pagesToShow = 2;

    const paginationList = document.createElement("ul");
    paginationList.classList.add("pagination", "justify-content-center", "flex-wrap");

    // Botón Previous
    const previousPageItem = createPaginationItem("Previous", currentPage - 1);
    paginationList.appendChild(previousPageItem);

    // Primera página
    if (currentPage > pagesToShow + 1) {
        const firstPageItem = createPaginationItem(1, 1);
        paginationList.appendChild(firstPageItem);

        // Agregar puntos suspensivos si hay un gap
        if (currentPage > pagesToShow + 2) {
            const ellipsisItem = document.createElement("li");
            ellipsisItem.classList.add("page-item", "disabled");
            ellipsisItem.innerHTML = '<span class="page-link">...</span>';
            paginationList.appendChild(ellipsisItem);
        }
    }

    // Páginas alrededor de la página actual
    for (let i = Math.max(1, currentPage - pagesToShow); i <= Math.min(totalPages, currentPage + pagesToShow); i++) {
        const pageItem = createPaginationItem(i, i);
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        paginationList.appendChild(pageItem);
    }

    // Última página
    if (currentPage < totalPages - pagesToShow) {
        // Agregar puntos suspensivos si hay un gap
        if (currentPage < totalPages - pagesToShow - 1) {
            const ellipsisItem = document.createElement("li");
            ellipsisItem.classList.add("page-item", "disabled");
            ellipsisItem.innerHTML = '<span class="page-link">...</span>';
            paginationList.appendChild(ellipsisItem);
        }

        const lastPageItem = createPaginationItem(totalPages, totalPages);
        paginationList.appendChild(lastPageItem);
    }

    // Botón Next
    const nextPageItem = createPaginationItem("Next", currentPage + 1);
    paginationList.appendChild(nextPageItem);

    paginationContainer.appendChild(paginationList);

    function createPaginationItem(text, page) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");

        const pageLink = document.createElement("a");
        pageLink.classList.add("page-link");
        pageLink.innerText = text;
        pageLink.href = "#";
        pageLink.addEventListener("click", (event) => {
            event.preventDefault();
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                // Verificar si hay una categoría seleccionada
                const urlCategory = localStorage.getItem("categoria_url");
                if (urlCategory) {
                    loadPokemonByCategory();
                } else {
                    getAllPokemon();
                }
            }
        });

        if ((text === "Previous" && currentPage === 1) ||
            (text === "Next" && currentPage === totalPages)) {
            pageItem.classList.add("disabled");
        }

        pageItem.appendChild(pageLink);
        return pageItem;
    }
}


/**
 * Gestión de la compra
 * --------------------
*/

/**
 * Procesa la compra de los productos en el carrito
 * 
 * Esta función verifica si hay productos en el carrito y procesa la compra.
 * Si el carrito está vacío, muestra una alerta al usuario.
 * Si hay productos, los registra en la consola y limpia el carrito.
 * 
 * @returns {void} No retorna valor, pero puede mostrar alertas o limpiar el carrito
 */
function realizarCompra() {
    if (productosCarrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'No hay productos en el carrito',
            confirmButtonColor: '#2a75bb'
        });
        pintarCarrito();
        guardarCarrito();
        return;
    }

    // Aquí iría la llamada al API de compra (POST a tu backend)
    // Ejemplo:
    // fetch('URL_DE_TU_API/compra', {
    //     method: 'POST',
    //     body: JSON.stringify(productosCarrito),
    //     headers: { 'Content-Type': 'application/json' }
    // })
    // .then(res => res.json())
    // .then(data => {
    //     // Manejar respuesta de la compra
    // });

    // Simulación de compra exitosa
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada!',
        text: 'Tu compra se ha procesado correctamente.',
        confirmButtonColor: '#2a75bb'
    }).then(() => {
        p = [];
        guardarCarrito();
        pintarCarrito();
    });
}

/**
 * Desplaza la página suavemente hacia arriba
 * 
 * Esta función realiza un scroll suave hasta la parte superior
 * de la página utilizando la API de scroll del navegador.
 * 
 * @returns {void} No retorna valor, pero modifica la posición del scroll
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Inicialización y Configuración de Eventos
 * ----------------------------------------
 * Este bloque de código maneja la inicialización de componentes y la configuración
 * de eventos cuando el DOM está completamente cargado.
 */

/**
 * Inicializa la aplicación y configura los eventos
 * 
 * Esta función se encarga de inicializar la aplicación y configurar los eventos
 * que se ejecutarán cuando el DOM esté completamente cargado.
 * 
 * @returns {void} No retorna valor, pero configura los eventos
 */
const initializeApp = () => {
    cargarCarrito();
    pintarCarrito();
    carrusel();
    setupSearchInput();
    setupModalEvents();
    setupDragAndDrop();
};

/**
 * Configura el evento de entrada en el input de búsqueda
 * 
 * Esta función se encarga de configurar el evento de entrada en el input de búsqueda
 * que se ejecutará cuando el usuario escriba en el input.
 * 
 * @returns {void} No retorna valor, pero configura el evento
 */
const setupSearchInput = () => {
    const searchInput = document.getElementById("txtBuscar");
    if (searchInput) {
        searchInput.addEventListener("input", autoCompletePokemon);
    }
};

/**
 * Configura los eventos del modal
 * 
 * Esta función se encarga de configurar los eventos del modal
 * que se ejecutarán cuando el modal se muestre.
 * 
 * @returns {void} No retorna valor, pero configura el evento
 */
const setupModalEvents = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
        modal.addEventListener('show.bs.modal', () => {
            const cantidadInput = document.getElementById('cantidadDetalle');
            if (cantidadInput) cantidadInput.value = 1;
        });
    }
};

/**
 * Configura los eventos de arrastrar y soltar en el carrito
 * 
 * Esta función se encarga de configurar los eventos de arrastrar y soltar en el carrito
 * que se ejecutarán cuando el usuario arrastre y suelte un Pokémon en el carrito.
 * 
 * @returns {void} No retorna valor, pero configura el evento
 */
const setupDragAndDrop = () => {
    const cartButton = document.getElementById('cartPokemon');
    if (!cartButton) return;

    cartButton.addEventListener('dragover', e => {
        e.preventDefault();
        cartButton.classList.add('drag-over');
    });

    cartButton.addEventListener('dragleave', () => {
        cartButton.classList.remove('drag-over');
    });

    cartButton.addEventListener('drop', () => {
        cartButton.classList.remove('drag-over');
    });

    document.addEventListener('dragend', () => {
        document.querySelectorAll('.dragging').forEach(el =>
            el.classList.remove('dragging'));
        cartButton.classList.remove('drag-over');
    });
};

/**
 * Inicializa la aplicación cuando el DOM esté completamente cargado
 * 
 * Esta función se encarga de inicializar la aplicación cuando el DOM esté completamente cargado
 * que se ejecutará cuando el DOM esté completamente cargado.
 *  
 */
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Muestra todos los Pokémon disponibles
 * ------------------------------------
 * Esta función resetea el filtro de categoría y muestra todos los Pokémon.
 * También actualiza la interfaz para reflejar que se están mostrando todos los Pokémon.
 */
function viewAllPokemon() {
    localStorage.removeItem("categoria");
    currentPage = 1; // Resetear la página actual a 1
    getAllPokemon();
    document.getElementById('btn-mostrar-todos').classList.add('d-none');
    document.getElementById('categoria-actual').textContent = 'Todos los Pokémon';
}

/**
 * Control de Comportamiento del Header
 * -----------------------------------
 * Esta sección implementa un comportamiento inteligente del header que se oculta
 * al hacer scroll hacia abajo y reaparece al hacer scroll hacia arriba.
 * 
 * Variables:
 * - lastScrollTop: Almacena la última posición de scroll
 * - header: Referencia al elemento header del DOM
 * - scrollThreshold: Umbral mínimo de scroll para activar la animación
 */
let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = CONFIG.SCROLL_THRESHOLD;

const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > scrollThreshold) {
        header.classList.toggle('header-hidden', currentScroll > lastScrollTop);
    } else {
        header.classList.remove('header-hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
};

window.addEventListener('scroll', handleScroll);

/**
 * Obtiene los datos de los Pokémon a partir de sus URLs
 * @param {Array} pokemonList - Lista de Pokémon con sus URLs
 * @returns {Promise<Array>} Array de datos de Pokémon ordenados
 */
async function fetchPokemonData(pokemonList) {
    const pokemonPromises = pokemonList.map(async (element, index) => {
        const response_pokemon = await fetch(element.pokemon?.url || element.url);
        const data_pokemon = await response_pokemon.json();
        return { data_pokemon, index };
    });

    const pokemonData = await Promise.all(pokemonPromises);
    return pokemonData.sort((a, b) => a.index - b.index);
}

// Agregar estilos para el spinner de la grid
const gridLoadingStyle = document.createElement('style');
gridLoadingStyle.textContent = `
    .pokemon-grid-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        width: 100%;
    }
    .pokemon-grid-loading .pokeball-spinner {
        width: 80px;
        height: 80px;
        position: relative;
        animation: spin 1s linear infinite;
    }
    .pokemon-grid-loading .pokeball-top {
        position: absolute;
        width: 100%;
        height: 50%;
        background: #ff1a1a;
        border-radius: 40px 40px 0 0;
        border: 4px solid #000;
        border-bottom: none;
    }
    .pokemon-grid-loading .pokeball-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50%;
        background: #fff;
        border-radius: 0 0 40px 40px;
        border: 4px solid #000;
        border-top: none;
    }
    .pokemon-grid-loading .pokeball-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 25px;
        height: 25px;
        background: #fff;
        border: 4px solid #000;
        border-radius: 50%;
        z-index: 1;
    }
    .pokemon-grid-loading .pokeball-center::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #000;
        border-radius: 50%;
    }
    .pokemon-grid-loading .loading-text {
        margin-top: 1.5rem;
        font-size: 1.4rem;
        color: #2a75bb;
        font-weight: 500;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

document.head.appendChild(gridLoadingStyle);

// --- Carrito persistente con localStorage ---
function guardarCarrito() {
    localStorage.setItem('carritoPokemon', JSON.stringify(p));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoPokemon');
    if (carritoGuardado) {
        p = JSON.parse(carritoGuardado);
    }
}
