// Funciones del script del dragg and drop 
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    let namePokemon;
    switch (ev.target.nodeName) {
        case "DIV":
            namePokemon = ev.target.id.toLowerCase();
            break;
        case "IMG":
            namePokemon = ev.target.id.toLowerCase();
            break;
    }
    ev.dataTransfer.setData("name", namePokemon);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("name");
    console.log(data);
    backInfoPokemon(data)
}
//   
function backInfoPokemon(nombre) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
}

// ----------------- Funcionamiento carrusel multiple ------------------
function carrusel() {
    let myCarousel = document.querySelectorAll('#featureContainer .carousel .carousel-item');
    myCarousel.forEach((el) => {
        const minPerSlide = 4
        let next = el.nextElementSibling
        for (var i = 1; i < minPerSlide; i++) {
            if (!next) {
                // wrap carousel by using first child
                next = myCarousel[0]
            }
            let cloneChild = next.cloneNode(true)
            el.appendChild(cloneChild.children[0])
            next = next.nextElementSibling
        }
    })
}

//-------------------Funcion de Autocompletado ------------------
function autoCompletePokemon() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`)
        .then(response => response.json())
        .then(data => {
            let textoBuscar = document.getElementById("txtBuscar").value
            if (textoBuscar.length >= 2) {
                let lista = `<div class='list-group'>`
                let filtroPokemon = data.results.filter(filtrarPokemon)
                filtroPokemon.forEach(element => {
                    iconoPokemon(element.url)
                    lista += `<a onclick="detallePokemon('${element.url}')" href='detallePokemon33.html' class='list-group-item list-group-item-action'>${element.name} <img id="icono${element.name}" style="width:20%"></a>`
                });
                lista += `</div>`
                document.getElementById("listaPokemon").innerHTML = lista
                document.getElementById("listaPokemon").style = `position:absolute;top:70px;right:210px;width:30%;z-index:2000; height:600px;overflow:auto;`
            }
            if (textoBuscar == 0) {
                document.getElementById("listaPokemon").innerHTML = ""
            }
        })

}

//-------------------Funcion Filtrar Pokemon------------------
function filtrarPokemon(element) {
    let textoBuscar = document.getElementById("txtBuscar").value
    let nombre = element.name
    return nombre.includes(textoBuscar.toLowerCase())
}

//------------------Funcion Icono Pokemon---------------------
function iconoPokemon(urlPokemon) {
    fetch(urlPokemon)
        .then(response => response.json())
        .then(data => {
            document.getElementById(`icono${data.name}`).src = data.sprites.other["official-artwork"].front_default
        })
}

//___________________Guardar en LocalStorage Detalle Pokemon---------------------------
function detallePokemon(urlPokemon) {
    localStorage.urlDetalle = urlPokemon
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

//------------------- Obtener pokemon ----------------
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

//--------------------- imprimir Pokemon ------------------
function printCategorias() {
    typePokemon()
        .then((_response) => {
            let item = ""
            categorias.forEach((element, index) => {
                const imageUrl = imagenC(element.nombreCat);
                if (index == 0) {
                    item += `<div class="carousel-item active">
                        <div class="col-md-2">
                            <div class="card rounded-circle">
                                <div class="card-img" >
                                    <a class="text-center" onclick="urlLocal('${element.id}') , printPokemones()" id="toggle-link" href="#tipos">
                                        <img src="${imageUrl}"
                                            class="img-fluid">
                                    </a>
                                </div>
                                <div class="card-img-overlays">
                                    ${element.nombreCat}
                                </div>
                            </div>
                        </div>
                    </div>`
                } else {
                    item += `<div class="carousel-item">
                        <div class="col-md-2">
                            <div class="card rounded-circle">
                                <div class="card-img">
                                    <a class="text-center" onclick="urlLocal('${element.id}'),printPokemones()" id="toggle-link" type="button" href="#tipos">
                                        <img src="${imageUrl}" class="img-fluid">
                                    </a>
                                </div>
                                <div class="card-img-overlays">${element.nombreCat}</div>
                            </div>
                        </div>
                    </div>`
                }
            });
            document.getElementById("carouselCategorias").innerHTML = item
            carrusel()
        })
        .then((_response) => {
            let item = ""
            categorias.forEach((element) => {
                item += `
                <li>
                    <a onclick="urlLocal('${element.id}'),printPokemones()" href="#tipos" class="dropdown-item">
                        ${element.nombreCat}
                    </a>
                </li>`
            });
            document.getElementById("pokemon-categoria").innerHTML = item;
        })
}

//--------------- Guardar la url en el LocalStorage ----------------
function urlLocal(id) {
    localStorage.setItem("categoria", id);
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
            rowContent += "<div class='row'>"; // Abrir una nueva fila
        }
        const card = `
        <div class="col-md-3" draggable="true" ondragstart="drag(event)" id="${element.nombrePro}">
          <div class="card text-center">
            <img src="${element.urlFoto}" class="card-img-top" alt="${element.nombrePro}" id="${element.nombrePro}">
            <div class="card-body">
              <h5 class="card-title">${element.nombrePro}</h5>
              <p class="card-text">${element.categoria}</p>
              <p class="card-text">$${element.precioPro}</p>
              <!--<div class="d-flex">
              <label class="mx-3">Cantidad: </label>
              <input type="number" max="${element.cantidadPro}" min="0" id="cantidad" class="form-control">
              </div>-->
              <a href="#" class="btn btn-primary mt-2" id="BtnAgregar" onclick="agregarAlCarrito(${element.id})">Agregar al Carrito</a>
            </div>
          </div>
        </div>
      `;
        rowContent += card;
        
        if ((index + 1) % 4 === 0 || index === data.length - 1) {
            rowContent += "</div>"; // Cerrar la fila actual

            cardContent += rowContent;
            rowContent = ""; // Reiniciar el contenido de la fila
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

// ----------- Traer los pokemon segun la caetgoria ---------
const pokemones = []
function loadPokemon() {
    return new Promise((resolve) => {
        let idCat = localStorage.categoria
        fetch('http://localhost/mvcPokemon/controllers/productos.readCat.php?categoria=' + idCat)
            .then(Response => Response.json())
            .then(data => {
                data.forEach(element => {
                    pokemones.push(element);
                    // datosPokemon(element.id)
                    resolve("Ok")
                });
            })
    })
}

async function printPokemones() {
    try {
        const response = await loadPokemon();
        let lista = "";
        const container = document.getElementById("listPokemonCategoria");
        container.innerHTML = "";
        const columnClass = "col-md-6"; // Nueva clase para mostrar dos productos por columna

        for (let i = 0; i < pokemones.length; i++) {
            const element = pokemones[i];
            const isFirstColumn = i % 2 === 0;

            // Agregar clase para determinar si es la primera columna o la segunda
            const columnStyleClass = isFirstColumn ? "" : "ms-md-auto";

            lista += `
            <div class="card mb-3 ${columnClass} ${columnStyleClass}" style="max-width: 540px;" draggable="true" ondragstart="drag(event)" id="${element.nombrePro}">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${element.urlFoto}" class="img-fluid rounded-start" alt="..." id="${element.nombrePro}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title text-uppercase">${element.nombrePro}</h5>
                            <p class="card-text">Categoría: ${element.categoria}</p>
                            <p class="card-text">Precio: $${element.precioPro}</p>
                            <button type="button" class="btn btn-secondary" onclick="getDetallePokemon('${element.id}')" data-bs-toggle="modal" data-bs-target="#exampleModal">Mas Detalles</button>
                            <button class="btn btn-primary">Añadir al Carrito</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            // Agregar clearfix para limpiar las columnas después de cada par de productos
            if (!isFirstColumn || i === pokemones.length - 1) {
                lista += `<div class="clearfix"></div>`;
            }
        }

        container.innerHTML = lista;
    } catch (error) {
        console.log(error);
    }
}


function getDetallePokemon(idP) {
    fetch("http://localhost/mvcPokemon/controllers/productos.readId.php?id=" + idP)
        .then(response => response.json())
        .then(data => {
            const detallePokemon = document.getElementById("detallePokemon");
            detallePokemon.innerHTML = `
                <div class="card mt-5">
                    <div class="d-flex justify-content-center">
                        <img src="${data.urlFoto}" class="card-img-top" alt="..." style="max-width: 350px;">
                    </div>
                    <div class="card-header mt-3 text-center bg-primary text-white">
                        <h5 class="card-title tipo-${data.categoriaP}">${data.nombrePro.toUpperCase()}</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                <h6 class="text-center text-secondary">Categoría</h6>
                                <p class="text-center">${data.categoriaP}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h6 class="text-center text-secondary">Precio</h6>
                                <p class="text-center">$${data.precioPro}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h6 class="text-center text-secondary">Unidades Disponibles</h6>
                                <p class="text-center">${data.cantidadPro} UND</p>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
}

// ------------Funciones del Carrito ---------------
let p = [];
async function agregarAlCarrito(elemento){
    const response = await fetch('http://localhost/mvcPokemon/controllers/productos.readId.php?id='+elemento)
    const data = await response.json()
    
    // Verificar si el producto ya está en el carrito
    const index = p.findIndex(producto => producto.id === data.id);
    if (index !== -1) {
        // Si el producto ya está en el carrito, incrementar su cantidad
        if (data.cantidadPro > p[index].cantidad) {
            p[index].cantidad++;
        } else {
            p[index].cantidad = data.cantidadPro;
        }
    } else {
        // Si el producto no está en el carrito, agregarlo con cantidad 1
        data.cantidad = 1;
        p.push(data);
    }

    pintarCarrito();
}

function pintarCarrito(){
    let card = "" 
    let total = 0;
    p.forEach(producto => {
        let precio = producto.precioPro * producto.cantidad
        total += precio;
            card += `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.urlFoto}" class="img-fluid rounded-start" alt="Imagen">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombrePro}</h5>
                            <p class="card-text"><small class="text-body-secondary">diponibles: ${producto.cantidadPro}</small></p>
                            <div class="d-flex">
                                <label class="card-text me-2">Cantidad:</label>
                                <input type="number" class="form-control" min="0" max="${producto.cantidadPro}" value="${producto.cantidad}" oninput="actualizarPrecio(${producto.id}, this.value)">
                            </div>
                            <div">
                                <label class="card-text me-2" id="precio-${producto.id}" >Precio: $${precio}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ` 
        document.getElementById('contenidoCarrito').innerHTML = card
        document.getElementById('total').innerHTML = total
    });
    let c = p.length
    actualizarNumeroCarrito(c)
}

function actualizarPrecio(id, cantidad) {
    const producto = p.find(producto => producto.id === id);
    if (producto) {
        producto.cantidad = parseInt(cantidad);
        const precio = producto.precioPro * producto.cantidad;
        document.getElementById(`precio-${producto.id}`).innerHTML = precio;
        document.getElementById('total').innerHTML = total
        actualizarTotal();
    }
}

function actualizarTotal() {
    let total = 0;
    p.forEach(producto => {
        const precio = producto.precioPro * producto.cantidad;
        total += precio;
    });
    document.getElementById('total').innerHTML = total;
}

function actualizarNumeroCarrito(cantidad) {
    const carritoNumero = document.getElementById("carrito-numero");
    carritoNumero.innerText = cantidad.toString();

    // Mostrar u ocultar el número según la cantidad de productos en el carrito
    if (cantidad > 0) {
        carritoNumero.style.display = "block";
    } else {
        carritoNumero.style.display = "none";
    }
}

function limpiarCarrito(){
    p = [];
    document.getElementById('contenidoCarrito').innerHTML = "";
    document.getElementById('total').innerHTML = "";
    pintarCarrito();
}