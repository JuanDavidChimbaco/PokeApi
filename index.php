<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="assets_Front/img/007.png">
    <title>pokeApi</title>

    <!-- Bootstrap 5.3  -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossorigin="anonymous"></script>

    <!-- SweetAlert2 -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js"></script>

    <!-- FontAwesome -->
    <script src="https://kit.fontawesome.com/6bf421ec3d.js" crossorigin="anonymous"></script>
    <link href="https://fonts.cdnfonts.com/css/pokemon-solid" rel="stylesheet">
    <link rel="stylesheet" href="assets_Front/css/style.css">
</head>

<body onload=" printCategories(), searchPokemon() ,getPokemon()" class="container">

    <!-- Header -->
    <header>
        <!-- Anuncio superior -->
        <div class="row g-0">
            <div class="col-12">
                <div class="d-flex align-items-center justify-content-center bg-dark text-white py-2">
                    <p class="header-envio m-0 text-center px-2"> Envío gratis a todo el mundo en compras de más de $499 </p>
                </div>
            </div>
        </div>

        <!-- Logo -->
        <div class="row py-3 g-0">
            <div class="col-12 text-center">
                <h1 class="logo"> Tienda Pokémon </h1>
            </div>
        </div>

        <!-- Barra de navegación -->
        <div class="row py-2 g-0">
            <div class="col-12">
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <!-- Búsqueda -->
                    <div class="flex-grow-1 position-relative">
                        <input type="search" class="form-control" name="txtBuscar" id="txtBuscar" 
                               placeholder="Buscar Pokémon..." onkeyup="autoCompletePokemon()"
                               autocomplete="off">
                        <div id="listaPokemon" class="w-100"></div>
                    </div>

                    <!-- Categorías -->
                    <div class="dropdown">
                        <button class="btn btn-outline-warning dropdown-toggle" type="button" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="d-none d-md-inline">Categorías</span>
                            <i class="fas fa-list d-md-none"></i>
                        </button>
                        <ul class="dropdown-menu overflow-auto" id="pokemon-categoria">
                            <!-- contenido categorias -->
                        </ul>
                    </div>

                    <!-- Carrito -->
                    <div class="cart-drop-zone" 
                         ondrop="drop(event)" 
                         ondragover="allowDrop(event)"
                         ondragleave="handleDragLeave(event)"
                         ondragenter="handleDragEnter(event)">
                        <button class="btn btn-outline-primary position-relative" 
                                id="cartPokemon" 
                                type="button" 
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#offcanvasRight" 
                                aria-controls="offcanvasRight" 
                                onclick="pintarCarrito()">
                            <i class="fas fa-cart-shopping fa-shake"></i>
                            <span id="carrito-numero" class="carrito-numero">0</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Content 1-->
    <div class="row g-0">
        <!-- carousel -->
        <div class="col-12 col-lg-8 BgCarousel">
            <div id="carouselExampleCaptions" class="carousel slide h-100" data-bs-ride="carousel">
                <!-- Carousel-Ejem-Poke -->
                <div class="carousel-inner h-100">
                    <div class="carousel-item active h-100">
                        <div class="d-flex flex-column flex-md-row h-100">
                            <div class="col-md-6 d-flex align-items-center justify-content-center p-3">
                                <img src="assets_Front/img/007.png" class="img-fluid pokemon-carousel-img" alt="Squirtle">
                            </div>
                            <div class="col-md-6 d-flex align-items-center p-3">
                                <div class="carousel-caption position-static text-dark">
                                    <h5 class="display-6">Squirtle</h5>
                                    <p class="d-none d-md-block">Pokémon de tipo agua introducido en la primera generación. Es uno de los Pokémon iniciales en la región Kanto, junto a Bulbasaur y Charmander.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item h-100">
                        <div class="d-flex flex-column flex-md-row h-100">
                            <div class="col-md-6 d-flex align-items-center justify-content-center p-3">
                                <img src="assets_Front/img/133.png" class="img-fluid pokemon-carousel-img" alt="Eevee">
                            </div>
                            <div class="col-md-6 d-flex align-items-center p-3">
                                <div class="carousel-caption position-static text-dark">
                                    <h5 class="display-6">Eevee</h5>
                                    <p class="d-none d-md-block">Pokémon de tipo normal introducido en la primera generación. Se caracteriza por ser el Pokémon con más evoluciones posibles, con ocho.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item h-100">
                        <div class="d-flex flex-column flex-md-row h-100">
                            <div class="col-md-6 d-flex align-items-center justify-content-center p-3">
                                <img src="assets_Front/img/134.png" class="img-fluid pokemon-carousel-img" alt="Vaporeon">
                            </div>
                            <div class="col-md-6 d-flex align-items-center p-3">
                                <div class="carousel-caption position-static text-dark">
                                    <h5 class="display-6">Vaporeon</h5>
                                    <p class="d-none d-md-block">Pokémon de tipo agua introducido en la primera generación. Es una de las ocho Eeveeluciones, es decir, las posibles evoluciones de Eevee.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>

        <!--  poke-Ads -->
        <div class="col-12 col-lg-4 bg-dark ads">
            <div class="p-3 text-center">
                <img src="assets_Front/img/singulares.png" alt="Imagen" class="img-fluid mb-3">
                <p class="text-white">Podrás Encontrar Pokemones Singulares A buen Precio</p>
            </div>
        </div>
    </div>

    <!-- Carousel-Categories -->
    <div class="row g-0 mt-2">
        <div class="col-12 bg-warning">
            <div class="container" id="featureContainer">
                <div class="row mx-auto my-auto justify-content-center">
                    <div id="featureCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="d-flex justify-content-between position-relative top-50 z-1 px-3"
                            style="z-index: 1;">
                            <a class="indicator" href="#featureCarousel" role="button" data-bs-slide="prev">
                                <span class="fas fa-chevron-left" aria-hidden="true"></span>
                            </a>
                            <a class="w-aut indicator" href="#featureCarousel" role="button" data-bs-slide="next">
                                <span class="fas fa-chevron-right" aria-hidden="true"></span>
                            </a>
                        </div>
                        <div class="carousel-inner" role="listbox" id="carouselCategorias">
                            <!-- Contenido del carrusel de categorias -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- content-Pokes -->
    <div class="row g-0">
        <div class="col-12">
            <div class="categoria-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 id="categoria-actual" class="mb-0">Todos los Pokémon</h4>
                    <button id="btn-mostrar-todos" class="btn d-none" onclick="mostrarTodos()">
                        <i class="fas fa-list"></i> <span class="d-none d-md-inline">Mostrar Todos</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="pagination-container" class="mt-2">
        </div>
        <div id="pokemon-container" class="container-fluid px-2">
        </div>
    </div>

    <!-- Balls -->
    <div class="balls-section">
        <div class="container">
            <div class="ball-container">
                <div class="ball-item">
                    <img src="assets_Front/img/masterball.png" alt="Master Ball">
                    <div class="ball-name">Master Ball</div>
                </div>
                <div class="ball-item">
                    <img src="assets_Front/img/pokeball.png" alt="Poké Ball">
                    <div class="ball-name">Poké Ball</div>
                </div>
                <div class="ball-item">
                    <img src="assets_Front/img/masterball1.png" alt="Ultra Ball">
                    <div class="ball-name">Ultra Ball</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Developers -->
    <div class="row bg-dark py-4 g-0">
        <div class="col-12">
            <h3 class="text-center text-warning mb-3">Nuestro Equipo</h3>
            <div class="row g-3 justify-content-center">
                <!-- Developer -->
                <div class="col-12 col-sm-4">
                    <div class="team-card">
                        <div class="team-card-image">
                            <img src="https://www.w3schools.com/bootstrap4/img_avatar3.png" alt="Developer">
                        </div>
                        <div class="team-card-content">
                            <h4 class="team-card-name">Juan Developer</h4>
                            <p class="team-card-role">Full Stack</p>
                            <div class="team-social-links">
                                <a href="#" class="team-social-link" title="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                                <a href="#" class="team-social-link" title="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Designer -->
                <div class="col-12 col-sm-4">
                    <div class="team-card">
                        <div class="team-card-image">
                            <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" alt="Designer">
                        </div>
                        <div class="team-card-content">
                            <h4 class="team-card-name">María Designer</h4>
                            <p class="team-card-role">UI/UX</p>
                            <div class="team-social-links">
                                <a href="#" class="team-social-link" title="Behance">
                                    <i class="fab fa-behance"></i>
                                </a>
                                <a href="#" class="team-social-link" title="Dribbble">
                                    <i class="fab fa-dribbble"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Manager -->
                <div class="col-12 col-sm-4">
                    <div class="team-card">
                        <div class="team-card-image">
                            <img src="https://www.w3schools.com/bootstrap4/img_avatar6.png" alt="Manager">
                        </div>
                        <div class="team-card-content">
                            <h4 class="team-card-name">Carlos Manager</h4>
                            <p class="team-card-role">Project Manager</p>
                            <div class="team-social-links">
                                <a href="#" class="team-social-link" title="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="#" class="team-social-link" title="Email">
                                    <i class="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row footer-content">
                <div class="col-lg-6">
                    <h5 class="footer-title">Redes Sociales</h5>
                    <div class="social-links">
                        <a href="https://www.facebook.com/" target="_blank" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com/" target="_blank" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" title="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" title="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 text-lg-end">
                    <h5 class="footer-title">@By:JDC</h5>
                    <img src="assets_Front/img/balls.jpg" alt="Logo Pokémon" class="footer-logo">
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Tienda Pokémon. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

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
            <label for="">Total:</label><label for="" id="total" class="btn btn-dark"></label>
            <button type="button" class="btn btn-primary mx-2" onclick="realizarCompra()">
                Realizar Compra
            </button>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog">
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

    <!-- boton para volver a la parte superior -->
    <a href="#" class="scroll-to-top" onclick="scrollToTop()">
        <i class="fas fa-arrow-up"></i>
    </a>

    <!-- script -->
    <script src="assets_Front/js/script.js"></script>
    <script>
        // Manejar el foco en los modales
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('exampleModal');
            const offcanvas = document.getElementById('offcanvasRight');

            // Para el modal
            modal.addEventListener('show.bs.modal', function() {
                this.removeAttribute('aria-hidden');
            });

            modal.addEventListener('hidden.bs.modal', function() {
                this.setAttribute('aria-hidden', 'true');
            });

            // Para el offcanvas
            offcanvas.addEventListener('show.bs.offcanvas', function() {
                this.removeAttribute('aria-hidden');
            });

            offcanvas.addEventListener('hidden.bs.offcanvas', function() {
                this.setAttribute('aria-hidden', 'true');
            });
        });
    </script>
</body>

</html>