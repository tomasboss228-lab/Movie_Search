const API_KEY = "b5f0a15f";

const input = document.getElementById("searchInput");
const result = document.getElementById("result");
const suggestionsBox = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

const topMovies = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Forrest Gump",
  "Inception",
  "Interstellar",
  "Fight Club",
  "Pulp Fiction"
];


async function loadTopMovies() {
  result.innerHTML = `<div class="grid"></div>`;
  const grid = result.querySelector(".grid");

  const movies = await Promise.all(
    topMovies.map(t =>
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(t)}&apikey=${API_KEY}`)
        .then(r => r.json())
    )
  );

  movies
    .filter(m => m.Response === "True")
    .sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating))
    .forEach(m => grid.appendChild(createCard(m)));
}


function createCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image";

  const title = document.createElement("p");
  title.textContent = movie.imdbRating && movie.imdbRating !== "N/A"
    ? `⭐ ${movie.imdbRating} · ${movie.Title}`
    : movie.Title;

  card.append(img, title);
  card.onclick = () => openMovie(movie.Title);

  return card;
}


function openMovie(title) {
  fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
    .then(r => r.json())
    .then(m => {
      result.innerHTML = `
        <div class="movie-container">
          <img src="${m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450"}">
          <div>
            <h2>${m.Title} (${m.Year})</h2>
            <p>${m.Plot}</p>
            <p><b>Genre:</b> ${m.Genre}</p>
            <p><b>IMDb:</b> ⭐ ${m.imdbRating}</p>
          </div>
        </div>
      `;
    });
}


function searchMovie(query) {
  if (!query) return;

  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
      if (!d.Search) {
        result.innerHTML = "<p style='padding:30px'>Нічого не знайдено 😢</p>";
        return;
      }

      result.innerHTML = `<div class="grid"></div>`;
      const grid = result.querySelector(".grid");

      d.Search.slice(0, 24).forEach(m => grid.appendChild(createCard(m)));
    });
}


function searchGenre(genre) {
  searchMovie(genre);
}


searchBtn.onclick = () => {
  searchBtn.classList.add("animate");
  setTimeout(() => searchBtn.classList.remove("animate"), 300);
  searchMovie(input.value);
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});


loadTopMovies();
