const API_KEY = "1b30c32fa88c3ac53722e8ba4733e1f9";
const API_URL_POPULAR =
  `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const API_URL_SEARCH =
  `https://api.themoviedb.org/3/search/movie?sort_by=popularity&api_key=${API_KEY}&query=`;
const IMG_URL = "https://image.tmdb.org/t/p/w1280";

const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const main = document.getElementById("main");

init();

function init() {
  displayMovies(API_URL_POPULAR);
  setupForm();
}

async function displayMovies(url) {
  try {
    const movies = await getMovies(url);
    const movieElements = movies.map(createMovieElement);
    renderMovies(movieElements);
  } catch (error) {
    console.error(error);
    renderErrorMessage("Failed to load movies.");
  }
}

async function getMovies(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

function createMovieElement(movie) {
  const { title, poster_path, vote_average, overview } = movie;
  const movieElement = document.createElement("div");
  movieElement.className = "movie";
  movieElement.innerHTML = `
    <img src="${IMG_URL + poster_path}" alt="${title}">
    <div class="movieInfo">
      <h3>${title}</h3>
      <span class="${getClassByRating(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h4>Overview</h4>
      <p>${overview}</p>
    </div>`;
  return movieElement;
}

function renderMovies(movieElements) {
  main.innerHTML = "";
  movieElements.forEach((movieElement) => {
    main.appendChild(movieElement);
  });
}

function renderErrorMessage(message) {
  main.innerHTML = `<p>${message}</p>`;
}

function getClassByRating(rating) {
  if (rating >= 8) {
    return "green";
  } else if (rating >= 5) {
    return "yellow";
  } else {
    return "red";
  }
}

function setupForm() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      const url = API_URL_SEARCH + encodeURIComponent(searchTerm);
      displayMovies(url);
      searchInput.value = "";
    }
  });
}
