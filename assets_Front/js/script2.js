const pokemones = []
function loadPokemon() {
    return new Promise((resolve) => {
        let idCat = localStorage.categoria
        fetch('../mvcPokemon/controllers/productos.readCat.php?categoria='+idCat)
            .then(Response => Response.json())
            .then(data => {
                document.getElementById("titulo").innerHTML = `Categoria Pokemon ${data[0].categoria}`
                data.forEach(element => {
                    pokemones.push(element);
                    datosPokemon(element.id)
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
                                <a onclick="detallePokemon('${element.id}')" href="detallePokemon33.html">
                                    <img id="img${element.nombrePro}" src="..." class="img-fluid rounded-start" alt="...">
                                </a>
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title text-center text-info text-uppercase">${element.nombrePro}</h5>
                                        <p class="card-text" id="desc${element.nombrePro}"> </p>
                                        <p class="card-text"><small class="text-muted" id="can${element.nombrePro}"> </small></p>
                                        <a class="btn btn-secondary" onclick="detallePokemon('${element.id}')" href="detallePokemon33.html">Mas Detalles</a>
                                        <button class="btn btn-primary">Añadir al Carrito</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
            });
            document.getElementById("listaPokemon").innerHTML = lista 
        })

}

function datosPokemon(id) {    
    fetch("../mvcPokemon/controllers/productos.readId.php?id="+id)
    .then((Response) => Response.json())
    .then(data => {
        document.getElementById(`img${data.nombrePro}`).src = data.urlFoto
        document.getElementById(`desc${data.nombrePro}`).innerHTML = `<b>Precio:</b> $${(data.precioPro)}<br> <b>Categoria :</b> ${(data.categoriaP)}`
        document.getElementById(`can${data.nombrePro}`).innerHTML = `Disponible: ${data.cantidadPro} UND`
    })
}

function detallePokemon(idP){
    localStorage.idProducto = idP 
}


