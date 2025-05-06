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
    ev.currentTarget.classList.add('drag-over');
}

/**
 * Maneja el evento cuando un elemento entra en el área del carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function handleDragEnter(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
}

/**
 * Maneja el evento cuando un elemento sale del área del carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function handleDragLeave(ev) {
    ev.currentTarget.classList.remove('drag-over');
}

/**
 * Inicia el arrastre de un Pokémon
 * @param {DragEvent} ev - Evento de arrastre
 */
function drag(ev) {
    const target = ev.target.closest('.pokemon-card');
    if (!target) return;
    
    const pokemonId = target.getAttribute('data-pokemon-id');
    ev.dataTransfer.setData('pokemonId', pokemonId);
    target.classList.add('dragging');
}

/**
 * Maneja el evento cuando se suelta un Pokémon en el carrito
 * @param {DragEvent} ev - Evento de arrastre
 */
function drop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    
    const pokemonId = ev.dataTransfer.getData('pokemonId');
    if (pokemonId) {
        agregarAlCarrito(parseInt(pokemonId));
    }
}

/**
 * Obtiene información detallada de un Pokémon desde la API
 * @param {string} nombre - Nombre del Pokémon
 * @returns {Promise<void>}
 */
async function backInfoPokemon(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.status}`);
        }
        const data = await response.json();
        console.log('Información del Pokémon:', data);
    } catch (error) {
        console.error('Error:', error);
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
 * Realiza la búsqueda de Pokémon con autocompletado
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

        const lista = filteredPokemon.map(pokemon => `
            <a onclick="detallePokemon('${pokemon.url}')" 
               href='detallePokemon33.html' 
               class='list-group-item list-group-item-action'>
                ${pokemon.name} 
                <img id="icono${pokemon.name}" 
                     class="pokemon-icon" 
                     alt="${pokemon.name}">
            </a>
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

        filteredPokemon.forEach(pokemon => loadPokemonIcon(pokemon.url, pokemon.name));
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        listaPokemon.innerHTML = "<div class='list-group-item text-danger'>Error al buscar Pokémon</div>";
    }
}

/**
 * Carga el icono de un Pokémon
 * @param {string} url - URL del Pokémon
 * @param {string} name - Nombre del Pokémon
 * @returns {Promise<void>}
 */
async function loadPokemonIcon(url, name) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar el icono');
        
        const data = await response.json();
        const iconElement = document.getElementById(`icono${name}`);
        if (iconElement) {
            iconElement.src = data.sprites.other["official-artwork"].front_default;
            iconElement.style.width = '20%';
        }
    } catch (error) {
        console.error(`Error al cargar icono de ${name}:`, error);
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
    const API_BASE_URL = "http://localhost/mvcPokemon/controllers";
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    if (window._pokemonCategoriesCache &&
        window._pokemonCategoriesCache.timestamp &&
        (Date.now() - window._pokemonCategoriesCache.timestamp < CACHE_DURATION)) {
        console.log("Devolviendo categorías desde caché");
        return window._pokemonCategoriesCache.data;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/categorias.read.php`);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        window._pokemonCategoriesCache = {
            data: data,
            timestamp: Date.now()
        };

        return data;
    } catch (error) {
        console.error("Error al obtener categorías de Pokémon:", error);
        throw error;
    }
}

/**
 * Imprime las categorías en el carrusel
 * @returns {Promise<void>}
 */
async function printCategories() {
    try {
        const categorias = await getPokemonCategories();
        let item = "";
        categorias.forEach((element, index) => {
            const imageUrl = imagenC(element.nombreCat);
            if (index == 0) {
                item += `<div class="carousel-item active">
                    <div class="col-md-3">
                        <div class="categoria-card">
                            <a class="text-center" onclick="urlLocal('${element.id}')" href="#pokemon-container">
                                <img src="${imageUrl}" class="categoria-img" alt="${element.nombreCat}">
                                <div class="categoria-title">${element.nombreCat}</div>
                            </a>
                        </div>
                    </div>
                </div>`
            } else {
                item += `<div class="carousel-item">
                    <div class="col-md-3">
                        <div class="categoria-card">
                            <a class="text-center" onclick="urlLocal('${element.id}')" href="#pokemon-container">
                                <img src="${imageUrl}" class="categoria-img" alt="${element.nombreCat}">
                                <div class="categoria-title">${element.nombreCat}</div>
                            </a>
                        </div>
                    </div>
                </div>`
            }
        });
        document.getElementById("carouselCategorias").innerHTML = item;
        carrusel();

        let itemMenu = "";
        categorias.forEach((element) => {
            itemMenu += `
            <li>
                <a onclick="urlLocal('${element.id}')" href="#pokemon-container" class="dropdown-item">
                    ${element.nombreCat}
                </a>
            </li>`;
        });
        document.getElementById("pokemon-categoria").innerHTML = itemMenu;
        
    } catch (error) {
        console.error("Error al imprimir categorías:", error);
        throw error;
    }
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
async function agregarAlCarrito(elemento) {
    const cantidadInput = document.getElementById('cantidadDetalle');
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;

    const response = await fetch('http://localhost/mvcPokemon/controllers/productos.readId.php?id=' + elemento)
    const data = await response.json()

    const index = p.findIndex(producto => producto.id === data.id);
    if (index !== -1) {
        const nuevaCantidad = p[index].cantidad + cantidad;
        if (nuevaCantidad <= data.cantidadPro) {
            p[index].cantidad = nuevaCantidad;
        } else {
            p[index].cantidad = data.cantidadPro;
            alert('Se ha alcanzado el límite de unidades disponibles');
        }
    } else {
        if (cantidad <= data.cantidadPro) {
            data.cantidad = cantidad;
            p.push(data);
        } else {
            data.cantidad = data.cantidadPro;
            p.push(data);
            alert('Se ha ajustado la cantidad al máximo disponible');
        }
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    if (modal) {
        modal.hide();
    }

    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
    offcanvas.show();

    pintarCarrito();
}

/**
 * Pinta el contenido del carrito
 */
function pintarCarrito() {
    let card = "";
    let total = 0;
    productosCarrito = [];

    if (p.length === 0) {
        document.getElementById('contenidoCarrito').innerHTML = '<div class="text-center p-3">El carrito está vacío</div>';
        document.getElementById('total').innerHTML = "$0";
        actualizarNumeroCarrito(0);
        return;
    }

    p.forEach(producto => {
        let precio = producto.precioPro * producto.cantidad;
        total += precio;
        card += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${producto.urlFoto}" alt="${producto.nombrePro}">
                </div>
                <div class="cart-item-details">
                    <h6 class="cart-item-title">${producto.nombrePro}</h6>
                    <div class="cart-item-info">
                        <span class="cart-item-price">$${producto.precioPro}</span>
                        <span class="cart-item-stock">Stock: ${producto.cantidadPro}</span>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="btn-quantity" onclick="actualizarCantidad(${producto.id}, ${producto.cantidad - 1})">-</button>
                            <input type="number" class="form-control" min="1" max="${producto.cantidadPro}" 
                                   value="${producto.cantidad}" onchange="actualizarCantidad(${producto.id}, this.value)">
                            <button class="btn-quantity" onclick="actualizarCantidad(${producto.id}, ${producto.cantidad + 1})">+</button>
                        </div>
                        <div class="cart-item-total">
                            <span>Total: $${precio}</span>
                        </div>
                    </div>
                    <button class="btn-remove" onclick="eliminarDelCarrito(${producto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        const productoCarrito = crearProductoCarrito(producto);
        productosCarrito.push(productoCarrito);
    });

    document.getElementById('contenidoCarrito').innerHTML = card;
    document.getElementById('total').innerHTML = `$${total}`;
    actualizarNumeroCarrito(p.length);
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} id - ID del producto
 * @param {number} nuevaCantidad - Nueva cantidad
 */
function actualizarCantidad(id, nuevaCantidad) {
    const producto = p.find(p => p.id === id);
    if (producto) {
        nuevaCantidad = parseInt(nuevaCantidad);
        if (nuevaCantidad >= 1 && nuevaCantidad <= producto.cantidadPro) {
            producto.cantidad = nuevaCantidad;
            pintarCarrito();
        } else if (nuevaCantidad > producto.cantidadPro) {
            producto.cantidad = producto.cantidadPro;
            alert('Se ha alcanzado el límite de unidades disponibles');
            pintarCarrito();
        }
    }
}

/**
 * Elimina un producto del carrito
 * @param {number} id - ID del producto a eliminar
 */
function eliminarDelCarrito(id) {
    p = p.filter(producto => producto.id !== id);
    pintarCarrito();
    
    if (p.length === 0) {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
        if (offcanvas) {
            offcanvas.hide();
        }
    }
}

/**
 * Actualiza el número de items en el carrito
 * @param {number} cantidad - Cantidad de items
 */
function actualizarNumeroCarrito(cantidad) {
    const carritoNumero = document.getElementById("carrito-numero");
    carritoNumero.innerText = cantidad.toString();
    carritoNumero.style.display = cantidad > 0 ? "block" : "none";
}

/**
 * Limpia el carrito
 */
function limpiarCarrito() {
    p = [];
    document.getElementById('contenidoCarrito').innerHTML = "";
    document.getElementById('total').innerHTML = "";
    pintarCarrito();
    
    const cantidadInput = document.getElementById('cantidadDetalle');
    if (cantidadInput) {
        cantidadInput.value = 1;
    }
}

//-------------------Funcion Filtrar Pokemon------------------
function filtrarPokemon(element) {
    let textoBuscar = document.getElementById("txtBuscar").value
    let nombre = element.name
    return nombre.includes(textoBuscar.toLowerCase())
}

//___________________Guardar en LocalStorage Detalle Pokemon---------------------------
function detallePokemon(urlPokemon) {
    localStorage.setItem('urlDetalle', urlPokemon);
}

//-----------------Funcion Evento Boton del Input search---------------------------------------
function searchPokemon() {
    document.getElementById("txtBuscar").addEventListener("search", (_event) => {
        document.getElementById("listaPokemon").innerHTML = "";
        document.getElementById("listaPokemon").style = "overflow:hidden";
        document.getElementById("txtBuscar").value = "";
    })
}

// ----------------- Funcionamiento pokeApi ------------------
const categorias = []
const palabras = []

//------------------- Obtener Las Categorias de los Pokemon -------------------
function typePokemon() {
    return new Promise((resolve) => {
        fetch("http://localhost/mvcPokemon/controllers/categorias.read.php")
            // controllers\categorias.read.php
            .then(Response => Response.json())
            .then(data => {
                data.forEach(element => {
                    categorias.push(element);
                });
                resolve("Categorias ok");
            })
    })
}

//--------------------- imprimir Categorias ------------------
/**
 * Imprime las categorías de Pokémon en el carrusel de la página principal.
 * 
 * Esta función asíncrona obtiene todas las categorías de Pokémon disponibles
 * a través de la función getPokemonCategories() y las muestra en un carrusel.
 * 
 * El proceso incluye:
 * 1. Obtener los datos de las categorías desde la API o caché
 * 2. Generar el HTML para cada categoría con su imagen correspondiente
 * 3. Marcar la primera categoría como activa en el carrusel
 * 4. Insertar el HTML generado en el elemento con ID "carouselCategorias"
 * 5. Inicializar el comportamiento del carrusel mediante la función carrusel()
 * 6. Actualizar el menú desplegable de categorías si es necesario
 * 
 * Cada categoría se muestra como una tarjeta circular con una imagen representativa
 * y tiene un evento onclick que filtra los Pokémon por esa categoría.
 * 
 * @returns {Promise<void>} No retorna valor, pero actualiza el DOM con las categorías
 * @throws {Error} Propaga cualquier error que ocurra durante la obtención de datos
 */

async function printPokemones() {
    await loadPokemon();
}

function getDetallePokemon(idP) {
    fetch("http://localhost/mvcPokemon/controllers/productos.readId.php?id=" + idP)
        .then(response => response.json())
        .then(data => {
            const detallePokemon = document.getElementById("detallePokemon");
            detallePokemon.innerHTML = `
                <div class="pokemon-detail-container">
                    <div class="row g-0">
                        <!-- Imagen del Pokémon -->
                        <div class="col-md-5 pokemon-detail-image">
                            <img src="${data.urlFoto}" class="img-fluid" alt="${data.nombrePro}">
                        </div>
                        
                        <!-- Información del Pokémon -->
                        <div class="col-md-7 pokemon-detail-info">
                            <div class="pokemon-header">
                                <h3 class="pokemon-name">${data.nombrePro.toUpperCase()}</h3>
                                <span class="pokemon-type badge bg-${getTypeColor(data.categoriaP)}">${data.categoriaP}</span>
                            </div>
                            
                            <div class="pokemon-stats">
                                <div class="stat-item">
                                    <i class="fas fa-tag"></i>
                                    <span class="stat-label">Precio:</span>
                                    <span class="stat-value">$${data.precioPro}</span>
                                </div>
                                <div class="stat-item">
                                    <i class="fas fa-box"></i>
                                    <span class="stat-label">Disponibles:</span>
                                    <span class="stat-value">${data.cantidadPro} unidades</span>
                                </div>
                            </div>

                            <div class="pokemon-actions mt-3">
                                <div class="d-flex gap-2">
                                    <div class="input-group input-group-sm" style="max-width: 150px;">
                                        <span class="input-group-text">Cantidad</span>
                                        <input type="number" class="form-control" min="1" max="${data.cantidadPro}" value="1" id="cantidadDetalle">
                                    </div>
                                    <button class="btn btn-primary flex-grow-1" onclick="agregarAlCarrito(${data.id})">
                                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
}

// Función auxiliar para obtener el color según el tipo de Pokémon
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

// ---------------------IMG - Categorias -----------------
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
    };
    return imageMap[name];
}

//--------------- Guardar la url en el LocalStorage ----------------
function urlLocal(id) {
    localStorage.setItem("categoria", id);
    loadPokemon(); // Cargar los Pokémon de la categoría seleccionada
}

const pokemonsPerPage = 8;
let currentPage = 1;

// -------------- Traer Todos los Pokemon + paginacion ------------------
async function getPokemon() {
    const offset = (currentPage - 1) * pokemonsPerPage;
    const limit = pokemonsPerPage;
    const response = await fetch(`http://localhost/mvcPokemon/controllers/productos.read.page.php?limit=${limit}&offset=${offset}`);
    const data = await response.json()

    let cardContent = "";
    let rowContent = "";

    data.forEach((element, index) => {
        if (index % 4 === 0) {
            rowContent += "<div class='row g-2'>";
        }
        const card = `
        <div class="col-md-3">
          <div class="card h-100 pokemon-card" 
               draggable="true" 
               ondragstart="drag(event)" 
               data-pokemon-id="${element.id}">
            <div class="card-img-container">
              <img src="${element.urlFoto}" class="card-img-top pokemon-img" alt="${element.nombrePro}">
            </div>
            <div class="card-body p-2">
              <h6 class="card-title mb-1">${element.nombrePro}</h6>
              <p class="card-text mb-1"><small class="text-muted">${element.categoria}</small></p>
              <p class="card-text mb-2 fw-bold">$${element.precioPro}</p>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-grow-1" 
                        onclick="getDetallePokemon('${element.id}')" 
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal">
                  <i class="fas fa-info-circle"></i> Detalles
                </button>
                <button class="btn btn-sm btn-primary flex-grow-1" 
                        onclick="agregarAlCarrito(${element.id})">
                  <i class="fas fa-cart-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
        rowContent += card;

        if ((index + 1) % 4 === 0 || index === data.length - 1) {
            rowContent += "</div>";
            cardContent += rowContent;
            rowContent = "";
        }
    });

    document.getElementById('pokemon-container').innerHTML = cardContent;
    const response2 = await fetch(`http://localhost/mvcPokemon/controllers/productos.read.count.php`);
    const data2 = await response2.json()
    createPagination(data2.total);
}

function createPagination(totalPokemons) {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalPokemons / pokemonsPerPage);

    const paginationList = document.createElement("ul");
    paginationList.classList.add("pagination", "justify-content-center");

    const previousPageItem = createPaginationItem("Previous", currentPage - 1);
    paginationList.appendChild(previousPageItem);

    for (let page = 1; page <= totalPages; page++) {
        const pageItem = createPaginationItem(page, page);
        paginationList.appendChild(pageItem);
    }

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
                getPokemon();
            }
        });

        if (text === "Previous" && currentPage === 1) {
            pageItem.classList.add("disabled");
        }

        if (text === "Next" && currentPage === totalPages) {
            pageItem.classList.add("disabled");
        }

        pageItem.appendChild(pageLink);
        return pageItem;
    }
}

// ----------- Traer los pokemon segun la categoria ---------
async function loadPokemon() {
    try {
        let idCat = localStorage.categoria;
        if (!idCat) {
            // Si no hay categoría seleccionada, mostrar todos los Pokémon
            getPokemon();
            document.getElementById('btn-mostrar-todos').classList.add('d-none');
            document.getElementById('categoria-actual').textContent = 'Todos los Pokémon';
            return;
        }

        const response = await fetch(`http://localhost/mvcPokemon/controllers/productos.readCat.php?categoria=${idCat}`);
        const data = await response.json();
        
        if (data.length === 0) {
            alert('No hay Productos de esta Categoría Por el momento');
            return;
        }

        // Mostrar el botón de "Mostrar Todos" y actualizar el título
        document.getElementById('btn-mostrar-todos').classList.remove('d-none');
        document.getElementById('categoria-actual').textContent = `Categoría: ${data[0].categoria}`;

        // Usar el mismo formato de tarjetas que en getPokemon
        let cardContent = "";
        let rowContent = "";

        data.forEach((element, index) => {
            if (index % 4 === 0) {
                rowContent += "<div class='row g-2'>";
            }
            const card = `
            <div class="col-md-3">
              <div class="card h-100 pokemon-card" 
                   draggable="true" 
                   ondragstart="drag(event)" 
                   data-pokemon-id="${element.id}">
                <div class="card-img-container">
                  <img src="${element.urlFoto}" class="card-img-top pokemon-img" alt="${element.nombrePro}">
                </div>
                <div class="card-body p-2">
                  <h6 class="card-title mb-1">${element.nombrePro}</h6>
                  <p class="card-text mb-1"><small class="text-muted">${element.categoria}</small></p>
                  <p class="card-text mb-2 fw-bold">$${element.precioPro}</p>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary flex-grow-1" 
                            onclick="getDetallePokemon('${element.id}')" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal">
                      <i class="fas fa-info-circle"></i> Detalles
                    </button>
                    <button class="btn btn-sm btn-primary flex-grow-1" 
                            onclick="agregarAlCarrito(${element.id})">
                      <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
              </div>
            </div>
          </div>
        `;
            rowContent += card;

            if ((index + 1) % 4 === 0 || index === data.length - 1) {
                rowContent += "</div>";
                cardContent += rowContent;
                rowContent = "";
            }
        });

        document.getElementById('pokemon-container').innerHTML = cardContent;
        
        // Actualizar la paginación
        createPagination(data.length);
        
        // Scroll suave hasta la sección de productos
        document.getElementById('pokemon-container').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al cargar Pokémon por categoría:', error);
        alert('Error al cargar los productos de esta categoría');
    }
}

// Modificar la función printPokemones para que use loadPokemon
async function printPokemones() {
    await loadPokemon();
}

function realizarCompra() {
    if (productosCarrito.length === 0) {
        alert('No hay produtos en el carrito')
    } else {
        console.log(productosCarrito);
        limpiarCarrito();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el carrusel
    carrusel();
    
    // Configurar el evento de búsqueda
    const searchInput = document.getElementById("txtBuscar");
    if (searchInput) {
        searchInput.addEventListener("input", autoCompletePokemon);
    }

    // Agregar un evento para reiniciar el input cuando se abre el modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
        modal.addEventListener('show.bs.modal', () => {
            const cantidadInput = document.getElementById('cantidadDetalle');
            if (cantidadInput) {
                cantidadInput.value = 1;
            }
        });
    }

    // Eventos para el drag and drop
    const cartButton = document.getElementById('cartPokemon');
    
    // Evento cuando se arrastra sobre el carrito
    cartButton.addEventListener('dragover', (e) => {
        e.preventDefault();
        cartButton.classList.add('drag-over');
    });
    
    // Evento cuando se sale del carrito
    cartButton.addEventListener('dragleave', () => {
        cartButton.classList.remove('drag-over');
    });
    
    // Evento cuando se suelta en el carrito
    cartButton.addEventListener('drop', () => {
        cartButton.classList.remove('drag-over');
    });
    
    // Evento cuando termina el drag
    document.addEventListener('dragend', () => {
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        cartButton.classList.remove('drag-over');
    });
});

// Función para mostrar todos los Pokémon
function mostrarTodos() {
    localStorage.removeItem("categoria");
    getPokemon();
    document.getElementById('btn-mostrar-todos').classList.add('d-none');
    document.getElementById('categoria-actual').textContent = 'Todos los Pokémon';
}

// Función para controlar el comportamiento del header al hacer scroll
let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = 50; // Umbral para activar la animación

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Solo activamos la animación después de pasar el umbral
    if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScrollTop) {
            // Scroll hacia abajo
            header.classList.add('header-hidden');
        } else {
            // Scroll hacia arriba
            header.classList.remove('header-hidden');
        }
    } else {
        // Si estamos cerca del top, mostramos el header
        header.classList.remove('header-hidden');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});