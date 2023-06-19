const pokemones = []
function loadPokemon() {
    return new Promise((resolve) => {
        let idCat = localStorage.categoria
        fetch('http://localhost/mvcPokemon/controllers/productos.readCat.php?categoria='+idCat)
            .then(Response => Response.json())
            .then(data => {
                document.getElementById("titulo").innerHTML = `Categoria Pokemon ${data[0].categoria}`
                data.forEach(element => {
                    pokemones.push(element);
                    datosPokemon(element.id)
                    resolve("Ok")
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
                                        <button type="button" class="btn btn-secondary" onclick="getDetallePokemon('${element.id}')" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Mas Detalles
                                        </button>
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
    fetch("http://localhost/mvcPokemon/controllers/productos.readId.php?id="+id)
    .then((Response) => Response.json())
    .then(data => {
        document.getElementById(`img${data.nombrePro}`).src = data.urlFoto
        document.getElementById(`desc${data.nombrePro}`).innerHTML = `<b>Precio:</b> $${(data.precioPro)}<br> <b>Categoria :</b> ${(data.categoriaP)}`
        document.getElementById(`can${data.nombrePro}`).innerHTML = `Disponible: ${data.cantidadPro} UND`
    })
}

function getDetallePokemon(idP){
    fetch("http://localhost/mvcPokemon/controllers/productos.readId.php?id="+idP)
    .then((response) => response.json())
    .then((data =>{
        console.log(data);
        document.getElementById("detallePokemon").innerHTML = 
        `<div class="card mt-5 shadow">
        <div class="d-grid justify-content-center rounded ">
            <img src="${data.urlFoto}" class="card-img-top" alt="..." style="width:350px">     
        </div>
            <div class="card-header mt-3 shadow">
                <div>
                    <h5 class="card-title text-center tipo-${data.categoriaP} rounded">${(data.nombrePro).toUpperCase()}</h5>    
                </div>
                <div class="row card-body">
                    <div class="col-6">
                        <h3 class="text-center">Categoria</h3>
                        <p class="text-center">${data.categoriaP}</p>
                    </div>
                    <div class="col-6">
                        <h3 class="text-center">Precio</h3>
                        <p class="text-center">$${data.precioPro}</p>
                    </div>
                    <div class="col">
                        <h3 class="text-center">Cantidad</h3>
                        <p class="text-center">${data.cantidadPro} UND</p>
                    </div>
                </div>
            </div>
      </div>`
    })); 
}


