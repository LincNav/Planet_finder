const searchInput = document.getElementById('search-input');
const autocompleteResults = document.getElementById('autocomplete-results');
const planetData = document.getElementById('planet-data');
const API_KEY = 'TG/Lkvstd+EDvV48zFROTw==41yI8r0yxctpymOr';

searchInput.addEventListener('input', handleSearchInput);

async function handleSearchInput(event) {
  const searchText = event.target.value.trim();
  if (searchText.length >= 1) {
    const planets = await filterPlanets(searchText);
    showPlanets(planets);
  } else {
    clearAutocomplete();
  }
}

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

async function filterPlanets(searchText) {
  const planets = await fetchPlanets(searchText);
  const filteredPlanets = planets.slice(0, 3);
  return filteredPlanets;
}

function showPlanets(planets) {
  clearAutocomplete();
  const planetList = document.createElement('ul');
  planetList.className = 'planet-list';

  planets.forEach((planet) => {
    const planetItem = document.createElement('li');
    planetItem.textContent = planet.name;
    planetItem.addEventListener('click', () => showPlanetInfo(planet));
    planetList.appendChild(planetItem);
  });

  autocompleteResults.appendChild(planetList);
}

function showPlanetInfo(planet) {
  const planetInfo = `
    <h2>${planet.name}</h2>
    <p>Mass: ${planet.mass}</p>
    <p>Radius: ${planet.radius}</p>
    <p>Period: ${planet.period}</p>
    <p>Semi-major Axis: ${planet.semi_major_axis}</p>
    <p>Temperature: ${planet.temperature}</p>
    <p>Distance (in light-years): ${planet.distance_light_year}</p>
    <p>Host Star Mass: ${planet.host_star_mass}</p>
    <p>Host Star Temperature: ${planet.host_star_temperature}</p>
  `;
  planetData.innerHTML = planetInfo;
}

function clearAutocomplete() {
  autocompleteResults.innerHTML = '';
  planetData.innerHTML = '';
}
