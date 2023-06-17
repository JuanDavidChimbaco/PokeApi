// Obtener el nombre de un Pokémon aleatorio
function getRandomPokemonName() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    return fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      .then(response => response.json())
      .then(data => data.name);
  }
  
  // Obtener detalles de un Pokémon por nombre
  function getPokemonDetails(name) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => response.json());
  }
  
  // Actualizar los detalles del Pokémon en la carta
  function updatePokemonDetails(details) {
    const card = document.querySelector('.card');
    const cardHeader = document.getElementById('pokemon-name');
    const cardImage = document.getElementById('pokemon-image');
    const cardCategory = document.getElementById('pokemon-category');
    const cardTypes = document.getElementById('pokemon-types');
    const cardHeight = document.getElementById('pokemon-height');
    const cardWeight = document.getElementById('pokemon-weight');
    const cardAbilities = document.getElementById('pokemon-abilities');
  
    cardHeader.textContent = details.name;
    cardImage.src = details.sprites.front_default;
    cardCategory.textContent = details.species.category;
    cardHeight.textContent = details.height;
    cardWeight.textContent = details.weight;
  
    // Limpiar los tipos anteriores
    cardTypes.innerHTML = '';
    details.types.forEach(type => {
      const span = document.createElement('span');
      span.textContent = type.type.name;
      span.className = 'badge bg-' + getTypeColor(type.type.name);
      cardTypes.appendChild(span);
    });
  
    // Limpiar las habilidades anteriores
    cardAbilities.innerHTML = '';
    details.abilities.forEach(ability => {
      const li = document.createElement('li');
      li.textContent = ability.ability.name;
      cardAbilities.appendChild(li);
    });
  
    card.classList.remove('d-none');
  }
  
  // Obtener el color de fondo según el tipo de Pokémon
  function getTypeColor(type) {
    const typeColors = {
      normal: 'light',
      fighting: 'danger',
      flying: 'primary',
      poison: 'success',
      ground: 'warning',
      rock: 'secondary',
      bug: 'info',
      ghost: 'dark',
      steel: 'secondary',
      fire: 'danger',
      water: 'primary',
      grass: 'success',
      electric: 'warning',
      psychic: 'info',
      ice: 'info',
      dragon: 'purple',
      dark: 'dark',
      fairy: 'pink',
      unknown: 'secondary',
      shadow: 'secondary'
    };
  
    return typeColors[type] || 'secondary';
  }
  
  // Obtener un Pokémon aleatorio y mostrar los detalles
  function getRandomPokemon() {
    getRandomPokemonName()
      .then(name => getPokemonDetails(name))
      .then(details => updatePokemonDetails(details))
      .catch(error => console.error(error));
  }
  
  // Obtener un Pokémon aleatorio al cargar la página
  document.addEventListener('DOMContentLoaded', getRandomPokemon);
  