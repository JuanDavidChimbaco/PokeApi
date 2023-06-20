<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="assets_Front/img/Squirtle.png">
    <title>pokeApi</title>

    <!-- Bootstrap 5.3  -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossorigin="anonymous"></script>

    <!-- FontAwesome -->
    <script src="https://kit.fontawesome.com/6bf421ec3d.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="assets_Front/css/style.css">
</head>

<body onload=" printCategorias(), searchPokemon() ,getPokemon()">

    <div class="container-fluid">

        <!-- Header -->
        <div class="row bg-secondary fixed-top" style="height:100px;">
            <div class="col-2 d-flex align-items-center">
                <h1 class="pokeapi mx-3"> Tienda Pokémon </h1>
            </div>
            <div class="col-5 d-flex align-items-center">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Categorias
                    </button>
                    <ul class="dropdown-menu overflow-auto" id="pokemon-categoria">
                        <!-- contenido categorias -->
                    </ul>
                </div>
            </div>

            <div class="col-4 d-flex align-items-center">
                <input type="search" class="form-control" name="txtBuscar" id="txtBuscar" placeholder="Buscar"
                    onkeyup="autoCompletePokemon()">
                <div id="listaPokemon"></div>
            </div>

            <div class="col-1 bg-white d-flex align-items-center justify-content-center">
                <button class="btn btn-outline-primary" ondrop="drop(event)" ondragover="allowDrop(event)"
                    id="cartPokemon" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight" onclick="pintarCarrito()">
                    <i class=" fas fa-cart-shopping fa-shake fa-2xl"></i>
                    <span id="carrito-numero" class="carrito-numero">0</span>
                </button>
            </div>

        </div>

        <!-- occupies the space of the header -->
        <div class="row" style="height: 100px; ;">
            <div class="col-12 bg-warning"> </div>
        </div>

        <!-- Content 1-->
        <div class="row" style="height:300px;">
            <!-- carousel -->
            <div class="col-8 bg-info BgCarousel">
                <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">

                    <!-- Carousel-Ejem-Poke -->
                    <div class="carousel-inner">

                        <div class="carousel-item active">
                            <img src="assets_Front/img/Squirtle.png" class="d-block w-100" alt="..."
                                style="height: 300px; object-position: top; object-fit: contain;">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Squirtle</h5>
                                <p>Pokémon de tipo agua introducido en la primera generación. Es uno de los Pokémon
                                    iniciales en la región Kanto, junto a Bulbasaur y Charmander, en las ediciones
                                    Pokémon Rojo, Pokémon Verde y Pokémon Azul y Pokémon Rojo Fuego y Pokémon Verde
                                    Hoja.</p>
                            </div>
                        </div>

                        <div class="carousel-item">
                            <img src="assets_Front/img/Eevee.png" class="d-block w-100" alt="..."
                                style="height: 300px; object-position: top; object-fit: contain;">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Eevee</h5>
                                <p>Pokémon de tipo normal introducido en la primera generación. Se caracteriza por ser
                                    el Pokémon con más evoluciones posibles, con ocho.</p>
                            </div>
                        </div>

                        <div class="carousel-item">
                            <img src="assets_Front/img/Vaporeon.png" class="d-block w-100" alt="..."
                                style="height: 300px; object-position: top; object-fit: contain;">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Vaporeon</h5>
                                <p>Pokémon de tipo agua introducido en la primera generación. Es una de las ocho
                                    Eeveeluciones, es decir, las posibles evoluciones de Eevee.</p>
                            </div>
                        </div>
                    </div>

                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>

                </div>
            </div>

            <!--  poke-Ads -->
            <div class="col-4 bg-dark ads">
                <img src="assets_Front/img/singulares.png" alt="Imagen" class="img-responsive">
                <p class="text-white text-center">Podras Encontrar Pokemones Singulares A buen Precio</p>
            </div>
        </div>

        <!-- Carousel-Categories -->
        <div class="row">
            <div class="col-12 bg-warning">
                <div class="container my-3 mt-5" id="featureContainer">
                    <div class="row mx-auto my-auto justify-content-center">
                        <div id="featureCarousel" class="carousel slide" data-bs-ride="carousel">
                            <div class="d-flex justify-content-between position-relative top-50 z-1 px-3"
                                style="z-index: 1;">
                                <a class="indicator" href="#featureCarousel" role="button" data-bs-slide="prev">
                                    <span class="fas fa-chevron-left" aria-hidden="true"></span>
                                </a> &nbsp;&nbsp;
                                <a class="w-aut indicator" href="#featureCarousel" role="button" data-bs-slide="next">
                                    <span class="fas fa-chevron-right" aria-hidden="true"></span>
                                </a>
                            </div>
                            <div class="carousel-inner" role="listbox" id="carouselCategorias">
                                <!-- content-carousel -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- content-Pokes -->
        <div class="row">
            <div id="pagination-container" class="mt-2">
            </div>
            <div id="pokemon-container">

            </div>
        </div>

        <!-- Balls -->
        <div class="row justify-content-between" style="height: 150px;">

            <div class="col-5 bg-warning ads">
                <img src="assets_Front/img/masterball.png" alt="Imagen" width="10%">
            </div>

            <div class="col-2 bg-dark ads">
                <img src="assets_Front/img/pokeball.png" alt="Imagen" class="img-responsive">
            </div>

            <div class="col-5 bg-secondary ads">
                <img src="assets_Front/img/masterball1.png" alt="Imagen" width="10%">
            </div>
        </div>

        <!-- poke por categorias -->
        <div class="row mx-2 mt-5" id="tipos">
            <div id="listPokemonCategoria" class="row mx-2">

            </div>
        </div>

        <!-- Devlopers -->
        <div class="row bg-dark align-items-center p-5">

            <div class="col-4 d-flex justify-content-center">
                <div class="card">
                    <img src="https://www.w3schools.com/bootstrap4/img_avatar3.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Developer</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>

            <div class="col-4 d-flex justify-content-center">
                <div class="card">
                    <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Designer</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>

            <div class="col-4 d-flex justify-content-center">
                <div class="card">
                    <img src="https://www.w3schools.com/bootstrap4/img_avatar6.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Manager</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="row">
                <footer class="bg-dark text-white py-4">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6">
                                <h5>Redes Sociales</h5>
                                <div class="d-flex">
                                    <a href="https://www.facebook.com/" class="me-3">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://twitter.com/" class="me-3">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://www.instagram.com/" class="me-3">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <h5>@By:JDC</h5>
                                <div class="d-flex justify-content-end">
                                    <img src=".//assets_Front/img/balls.jpg" alt="Logo Pokémon" class="me-3"
                                        style="max-width: 400px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
        </div>

        <!-- OFF CANVAS CARRITO -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasRightLabel">Carrito Pokemon</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body" id="contenidoCarrito">
                <!-- aqui va el contenido del carrito -->
            </div>
            <div class="offcanvas-bottom text-center">
                <button type="button" class="btn btn-danger mx-2" onclick="limpiarCarrito()">
                    Limpiar Carrito
                </button>
                $ <label for="" id="total"></label>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fs-1" id="exampleModalLabel">Detalle PokeProducto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div id="detallePokemon" class="p-3">

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>


        <script src="assets_Front/js/script.js"></script>
</body>

</html>