// Funciones del script del dragg and drop 
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    let namePokemon;
    switch (ev.target.nodeName) {
        case "DIV":
            namePokemon = ev.target.id.slice(4).toLowerCase();
            break;
        case "IMG":
            namePokemon = ev.target.id.slice(3).toLowerCase();
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
function backInfoPokemon(nombre){
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(response => response.json())
    .then(data =>{
        
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
function autoCompletePokemon(){
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`)
    .then(response => response.json())
    .then(data =>{
        let textoBuscar = document.getElementById("txtBuscar").value
        if (textoBuscar.length>=2){ 
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
        if(textoBuscar == 0){
            document.getElementById("listaPokemon").innerHTML = ""
        }
    })
    
}

//-------------------Funcion Filtrar Pokemon------------------
function filtrarPokemon(element){
    let textoBuscar = document.getElementById("txtBuscar").value
    let nombre = element.name 
    return nombre.includes(textoBuscar.toLowerCase())
}

//------------------Funcion Icono Pokemon---------------------
function iconoPokemon(urlPokemon){
    fetch(urlPokemon)
    .then(response => response.json())
    .then(data =>{
        document.getElementById(`icono${data.name}`).src = data.sprites.other["official-artwork"].front_default
    })
}

//___________________Guardar en LocalStorage Detalle Pokemon---------------------------
function detallePokemon(urlPokemon){
    localStorage.urlDetalle = urlPokemon
}

//-----------------Funcion Evento Boton del Input search---------------------------------------
function searchPokemon(){
    document.getElementById("txtBuscar").addEventListener("search",(event) => {
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
function imagenC(name){
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
        .then((response) => {
            let item = ""
            categorias.forEach((element, index) => {
                const imageUrl = imagenC(element.nombreCat);
                if (index == 0) {
                    item += `<div class="carousel-item active">
                        <div class="col-md-2">
                            <div class="card rounded-circle">
                                <div class="card-img" >
                                    <a class="text-center" onclick="urlLocal('${element.id}')" href="tipos.HTMl" >
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
                                    <a onclick="urlLocal('${element.id}')" href="tipos.HTMl">
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
        .then((response)=>{
            let item = ""
            categorias.forEach((element) => {
              item += ` <li><a onclick="urlLocal('${element.id}')" href="tipos.HTMl" class="dropdown-item">${element.nombreCat}</a></li>`
            });
            document.getElementById("pokemon-categoria").innerHTML = item
          })
}

//--------------- Guardar la url en el LocalStorage ----------------
function urlLocal(id){
    localStorage.setItem("categoria",id);
 }
