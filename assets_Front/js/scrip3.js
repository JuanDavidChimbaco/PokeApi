let idP = localStorage.idProducto

function getDetallePokemon(){
    fetch("../mvcPokemon/controllers/productos.readId.php?id="+idP)
    .then((response) => response.json())
    .then((data =>{
        console.log(data);
        document.getElementById("detalle").innerHTML = 
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

function regresar() {
    window.history.back();
  }



