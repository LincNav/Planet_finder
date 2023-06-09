// HTML elements
const searchInput = document.getElementById('search-input');
const autocompleteResults = document.getElementById('autocomplete-results');
const planetData = document.getElementById('planet-data');
const API_KEY = 'TG/Lkvstd+EDvV48zFROTw==41yI8r0yxctpymOr';
const NASA_API_KEY = 'htaMAw8CwKPtvQ3jAXuP40V8cxiWB9ui9x40Qr8D';

// Event listener for search input
searchInput.addEventListener('input', handleSearchInput);

// Handle search input
async function handleSearchInput(event) {
  const searchText = event.target.value.trim();
  if (searchText.length >= 1) {
    const planets = await filterPlanets(searchText);
    showPlanets(planets);
  } else {
    clearAutocomplete();
  }
}

// Fetch planets from the API
async function fetchPlanets(searchText) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/planets?name=${searchText}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch planets: ' + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Fetch planet image from NASA API
async function fetchPlanetImage(planetName) {
  try {
    const response = await fetch(`https://images-api.nasa.gov/search?q=${planetName}&media_type=image`, {
      headers: {
        'Authorization': NASA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch planet image: ' + response.status);
    }

    const data = await response.json();
    const item = data.collection.items.find(item => item.links && item.links.length > 0);
    if (item) {
      const image = item.links[0].href;
      return image;
    } else {
      throw new Error('Planet image not found');
    }
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}

// Filter planets based on search text
async function filterPlanets(searchText) {
  const planets = await fetchPlanets(searchText);
  const filteredPlanets = planets.slice(0, 3);
  return filteredPlanets;
}

// Show the list of planets in the autocomplete dropdown
async function showPlanets(planets) {
  clearAutocomplete();
  const planetList = document.createElement('ul');
  planetList.className = 'planet-list';

  for (const planet of planets) {
    const planetItem = document.createElement('li');
    planetItem.textContent = planet.name;
    planetItem.addEventListener('click', async () => {
      await showPlanetInfo(planet);
      const image = await fetchPlanetImage(planet.name);
      planet.image = image;
      showPlanetInfo(planet);
    });
    planetList.appendChild(planetItem);
  }

  autocompleteResults.appendChild(planetList);
}

// Show detailed information about a selected planet
// Show detailed information about a selected planet
function showPlanetInfo(planet) {
    clearAutocomplete();
    const planetInfo = `
      <div class="planet-details">
        <div class="planet-image">
          <img id="planet-image" src="loading.gif" alt="Loading...">
        </div>
        <div class="planet-info">
          <h2>${planet.name}</h2>
          <p>Mass: ${planet.mass}</p>
          <p>Radius: ${planet.radius}</p>
          <p>Period: ${planet.period}</p>
          <p>Semi-Major Axis: ${planet.semi_major_axis}</p>
          <p>Temperature: ${planet.temperature}</p>
          <p>Distance (in light-years): ${planet.distance_light_year}</p>
          <p>Host Star Mass: ${planet.host_star_mass}</p>
          <p>Host Star Temperature: ${planet.host_star_temperature}</p>
        </div>
      </div>
    `;
    planetData.innerHTML = planetInfo;
  
    const planetImage = document.getElementById('planet-image');
    fetchPlanetImage(planet.name)
      .then((image) => {
        planet.image = image;
        planetImage.src = image;
      })
      .catch((error) => {
        console.error('Error:', error);
        planetImage.src = 'error.png';
      });
  }
  

// Clear the autocomplete dropdown
function clearAutocomplete() {
  autocompleteResults.innerHTML = '';
  planetData.innerHTML = '';
}

const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;

