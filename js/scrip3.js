let urlDetalle = localStorage.urlDetalle
type = ""
stat = ""
baseStat = ""
habilidades = ""

function getDetallePokemon(){
    fetch(urlDetalle)
    .then((response) => response.json())
    .then((data =>{
        let tipo = ""
        console.log(data);
        // data.forEach(element => {
        //     element.types.forEach(type => {
        //         tipo.push(type)
        //         console.log(tipo);
        //     })
        // });
        type = data.types.map(tipo => tipo.type.name);
        stat = data.stats.map(stat => stat.stat.name);
        baseStat = data.stats.map(stat => stat.base_stat);
        habilidades = data.abilities.map(habilidades => habilidades.ability.name);
        const tipoPokemon = data.types[0].type.name;
        const divPokemon = document.getElementById('pokemon');
        
        divPokemon.className = `tipo-${tipoPokemon}`;

        document.getElementById("detalle").innerHTML = 
        `<div class="card mt-5">
        <div class="d-grid justify-content-center rounded ">
            <img src="${data.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="..." style="width:350px">     
        </div>
            <div class="card-header mt-3  ">
                <div>
                    <h5 class="card-title text-center tipo-${tipoPokemon} rounded">${(data.name).toUpperCase()}</h5>    
                </div>
                <div class="row card-body">
                    <div class="col-3">
                        <h3 class="text-center">Datos</h3>
                        Altura: ${data.height} Mtr<br>
                        Peso: ${data.weight} Kg  <br>
                        Exp Base: ${data.base_experience}  <br>  
                    </div>
                    <div class="col-3">
                        <h3 class="text-center">Estadisticas</h3>
                        ${stat[0]} : ${baseStat[0]}<br>
                        ${stat[1]} : ${baseStat[1]}<br>
                        ${stat[2]} : ${baseStat[2]}<br>
                        ${stat[3]} : ${baseStat[3]}<br>
                        ${stat[4]} : ${baseStat[4]}<br>
                        ${stat[5]} : ${baseStat[5]}<br>
                    </div>
                    <div class="col-3">
                        <h3 class="text-center"> Tipos  </h3>
                        <p class="card-text">${type}</p>
                    </div>
                    <div class="col-3">
                        <h3 class="text-center" > Habilidades </h3>
                        <p class="card-text">${habilidades}</p>
                    </div>
                </div>
            </div>
      </div>`
      document.getElementById("tipos").innerHTML = `
      <a href="">
        <img src="${data.sprites.versions["generation-v"]["black-white"].animated.front_default}" class=" rounded-top" alt="">
        <img src="${data.sprites.versions["generation-v"]["black-white"].animated.back_default}" class=" rounded-top" alt="">
        </a>
      `
      url = data.location_area_encounters
        console.log(url)
        fetch(url)
        .then((response) => response.json())
    })); 
}



