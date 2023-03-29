const pokemones = []
const cabeceras = { 'Accept-Language': 'es' };
function loadPokemon() {
    return new Promise((resolve) => {
        let urlPokemon = localStorage.url
        fetch(urlPokemon , { headers: cabeceras })
            .then(Response => Response.json())
            .then(data => {
                document.getElementById("titulo").innerHTML = `Categoria Pokemon ${data.names[5].name}`
                document.getElementById("tituloBarra").innerHTML = `Categoria Pokemon ${data.name}`
                console.log(data)
                data.pokemon.forEach(element => {
                    pokemones.push(element);
                    datosPokemon(element.pokemon.url)
                    resolve("Pokemones Cargados")
                });
            })
    })
}

function printPokemones() {
    loadPokemon()
        .then(response => {
            let lista = ""
            pokemones.forEach((element) => {
                lista +=`<div class="card mb-3 mx-3" style="max-width: 540px;">
                            <div class="row g-0">
                                <div class="col-md-4">
                                <a onclick="detallePokemon('${element.pokemon.url}')" href="detallePokemon33.html">
                                    <img id="img${element.pokemon.name}" src="..." class="img-fluid rounded-start" alt="...">
                                </a>
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title text-center text-info text-uppercase">${element.pokemon.name}</h5>
                                        <p class="card-text" id="desc${element.pokemon.name}"> </p>
                                        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                                    </div>
                                </div>
                            </div>
                        </div>`
            });
            document.getElementById("listaPokemon").innerHTML = lista 
        })

}

function datosPokemon(urlInfoPokemon) {
    
    fetch(urlInfoPokemon)
    .then((Response) => Response.json())
    .then(data => {
        console.log(data.name)
        document.getElementById(`img${data.name}`).src = data.sprites.other["official-artwork"].front_default
        document.getElementById(`desc${data.name}`).innerHTML = `<b>Peso:</b> ${(data.weight*0.1).toFixed(1)} kg <br> <b>altura :</b> ${(data.height*0.1).toFixed(1)} mts`
        //data.name
        //data.sprites.other["official-artworks"].front_default
    })
}
function detallePokemon(urlDetallePokemon){
    localStorage.urlDetalle = urlDetallePokemon 
}


