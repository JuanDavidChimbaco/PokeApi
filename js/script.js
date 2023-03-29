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
const cabeceras = {
    'Accept-Language': 'es'
  };
//------------------- Obtener pokemon ----------------
function typePokemon() {
    return new Promise((resolve) => {
        fetch("https://pokeapi.co/api/v2/type" ,  { headers: cabeceras })
            .then(Response => Response.json())
            .then(data => {

                data.results.forEach(element => {
                    categorias.push(element);
                });
                resolve("Categorias ok");
            })
    })
}
//--------------------- imprimir Pokemon ------------------
function printCategorias() {
    typePokemon()
        .then((response) => {
            let item = ""
            categorias.forEach((element, index) => {
                if (index == 0) {
                    item += `<div class="carousel-item active">
                        <div class="col-md-2">
                            <div class="card">
                                <div class="card-img" >
                                    <a onclick="urlLocal('${element.url}')" href="tipos.HTMl" >
                                        <img src="${element.name == "normal"? "img/Pokemon_Normal.png" : "img/Pokemon_Normal.png"}"
                                            class="img-fluid">
                                    </a>
                                </div>
                                <div class="card-img-overlays">
                                    ${element.name}
                                </div>
                            </div>
                        </div>
                    </div>`
                } else {
                    item += `<div class="carousel-item">
                        <div class="col-md-2">
                            <div class="card">
                                <div class="card-img">
                                    <a onclick="urlLocal('${element.url}')" href="tipos.HTMl">
                                        <img src="${element.name == "normal"? "img/Pokemon_Normal.png" : element.name == "fighting"? "img/Pokémon_Fighting.png" : element.name == "flying" ? "img/pokemon_flying.png":
                                        element.name == "poison" ? "img/Pokemon_Poison.png": element.name == "ground" ? "img/Pokemon_ground.png":
                                        element.name == "rock" ? "img/Pokemon_rock.png": element.name == "bug" ? "img/Pokemon_bug.png":
                                        element.name == "ghost" ? "img/Pokemon_ghost.png" : element.name == "steel" ? "img/Pokemon_steel.png":
                                        element.name == "fire" ? "img/Pokemon_fire.png" : element.name == "water" ? "img/Pokemon_water.png":
                                        element.name == "grass" ? "img/Pokemon_grass.png":element.name == "electric" ? "img/Pokemon_electric.png":
                                        element.name == "psychic" ? "img/Pokemon_psychic.png":element.name == "ice" ? "img/Pokemon_ice.png":
                                        element.name == "dragon" ? "img/Pokemon_dragon.png": element.name == "dark" ? "img/Pokemon_dark.png":
                                        element.name == "fairy" ? "img/Pokemon_fairy.png":element.name == "unknown" ? "img/Pokemon_unknown.png":
                                        element.name == "shadow" ? "img/Pokemon_unknown.png": null }"
                                         }"
                                            class="img-fluid">
                                    </a>
                                </div>
                                <div class="card-img-overlays">${element.name}</div>
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

              item += ` <li><a onclick="urlLocal('${element.url}')" href="tipos.HTMl" class="dropdown-item">${element.name}</a></li>`
            });
            document.getElementById("pokemon-categoria").innerHTML = item
          })
}
//----------------------Funcion images por tipo --------------para terminar
function imagen(element){

}
//--------------- Guardar la url en el LocalStorage ----------------
function urlLocal(url){
    localStorage.setItem("url",url);
 }
