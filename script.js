
const movieEl = document.querySelector(".movie");
const moviePopup = document.querySelector(".movie-popup")
const moviePopupOverlay = document.querySelector(".movie-popup-overlay");

const popularBtn = document.querySelector(".popular");
const ratedBtn = document.querySelector(".rated");
const dramaBtn = document.querySelector(".drama");

const collectionPopup = document.querySelector(".collection-popup");
const collectionPopupClose = collectionPopup.querySelector(".close-btn");
const menuBtn = document.querySelector(".menu");
const collectionDiv = document.querySelector(".collection-div");
const collections = document.querySelector(".collections");

// select ellipses to open menu icon
menuBtn.addEventListener("click", () => {
  collectionDiv.classList.toggle("show")
})

// open the collection popup
collections.addEventListener("click", () => {
  collectionPopup.classList.add("show");
  movieEl.classList.add("close");
})

// close the collection popup
collectionPopupClose.addEventListener("click", () => {
  collectionPopup.classList.remove("show");
  movieEl.classList.remove("close");
  if (collectionDiv.classList.contains("show")) {
    collectionDiv.classList.remove("show");
  }
})


const popularRated = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1"; //gotten from somewhere

// const HighestRated = "https://api.themoviedb.org/3/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";

const BestDrama2021 = "https://api.themoviedb.org/3/discover/movie?with_genres=18&primary_release_year=2021&api_key=04c35731a5ee918f014970082a0088b1&page=1";

const BestFrom2020 = "https://api.themoviedb.org/3/discover/movie?primary_release_year=2020&sort_by=vote_average.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";


const IMGPATH = 'https://image.tmdb.org/t/p/w1280' //gotten from somewhere

const movieBody = document.querySelector(".movie .movie-body");
const collectionBody = document.querySelector(".collection-body")

let moviesArr = [];
let watchedArr = [];
let collectionArr = [];


class UI {
  async getMovies(name = popularRated) {
    const respData = await (await fetch(name)).json();
    moviesArr = [...respData.results];
    return respData;
  }
  mapItems(respData) {
      let mapped = respData.results.map(item =>
        `
        <div class="movie-content" data-id=${item.id}>
          <div class="movie-img">
            <img src="${IMGPATH + item.poster_path}" alt="">
          </div>
          <div class="movie-info">
            <h3>${item.original_title} <span class="watched"><i class="fas fa-check"></i></span></h3>
            <p>Language : <span class="lang">${item.original_language}</span></p>
            <p class="release-date">${item.release_date}</p>
          </div>
          <div class="movie-rating">
            <span class="star"><i class="${item.vote_average > 5 ? "fas fa-star": "fas fa-star dark"}"></i></span>
            <span class="rating">${(!Number.isInteger(item.vote_average)) && (item.vote_average > 0) ? item.vote_average: item.vote_average + ".0"}</span>
          </div>
        </div>
        `
      )
      movieBody.innerHTML = mapped;
  }

  mapPopUp(item) {
    let mapped = `
    <div class="movie-popup-header">
      <img src="${IMGPATH + item.poster_path}" alt="${IMGPATH + item.poster_path}"><span class="playBtn"><i class="fas fa-play-circle"></i></span>
      <div class="movie-title"><h2>${item.original_title} (<span>${item.release_date.slice(0, 4)}</span>)</h2>
      <p>Released : ${item.release_date}</p></div>
    </div>
    <div class="movie-popup-func">
      <div class="watched"><span class="watchedBtn"><i class="fas fa-check"></i></span><p>set watched<span class="watched-id">( ${item.id} )</span></p></div>
      <div class="collection"><span class="collectionBtn"><i class="far fa-calendar-plus"></i></span><p>add to collection</p></div>
    </div>
  <div class="movie-popup-info"><p class="info">${item.overview}</p>
  </div>
  <p class="source">Source : <span> TheMovieDB</span> </p>
  <p class="date">Last Edited : <span>${item.release_date}</span></p>
  <p class="lang">Language : <span>${item.original_language}</span></p>
  <div class="achievement">
    <div class="votes"><span><i class="fas fa-poll"></i></span><p><span> ${item.vote_count} votes</span></p>
    </div><div class="rating"><span><i class="fas fa-star"></i></span><p><span>${item.vote_average}</span>/10 rating</p></div>
  </div>
  <div class="close-btn"><i class="fas fa-times"></i></div>`;

  moviePopup.innerHTML = mapped;

    // close the maped popup
  const closeBtn = document.querySelector(".close-btn");

  closeBtn.addEventListener("click", () => {
    moviePopup.classList.add("close");
    setTimeout(function() {
      moviePopupOverlay.classList.add("close");
    }, 150)
  })
  }
  mappedCollectionPopup() {
    const gottenCollections = Store.getCollections();
    let result = "";

    gottenCollections.forEach(collection => {
      if (collection.selected) {
        result += `
        <div class="collection-content" data-id=${collection.id}>
        <div class="collection-img">
          <img src="${IMGPATH + collection.content.poster_path}" alt="">
        </div>
        <div class="collection-info">
          <h3>${collection.content.original_title}</h3>
          <p class="release-date">${collection.content.release_date}</p>
          <div class="collection-rating">
            <span class="star"><i class="${collection.content.vote_average > 5 ? "fas fa-star": "fas fa-star dark"}"></i></span>
            <span class="rating">${(!Number.isInteger(collection.content.vote_average)) && (collection.content.vote_average > 0) ? collection.content.vote_average: collection.content.vote_average + ".0"}</span>
          </div>
        </div> 
        </div>
        `;
      }
    })
    collectionBody.innerHTML = result;

  }
  toggleBtns() {
    popularBtn.addEventListener("click", () => {
      this.toggleLogic(popularRated)
    })
    ratedBtn.addEventListener("click", () => {
      this.toggleLogic(BestFrom2020);
    })
    dramaBtn.addEventListener("click", () => {
      this.toggleLogic(BestDrama2021);
    })
  }

  async toggleLogic(name) {
      const respData = await this.getMovies(name);
      this.mapItems(respData);
      moviesArr = [...respData.results]
      Store.saveMovies()
      this.movieList()
  }

  movieList() {
    const movieContent = [...movieBody.children];
    const watchedMovie = Store.getWatched();
    

    movieContent.forEach(content => {
      content.addEventListener("click", () => {

        const id = Number(content.dataset.id);
        const contentItem = moviesArr.find(item => item.id === id)
        this.mapPopUp(contentItem);
        moviePopup.classList.remove("close");
        moviePopupOverlay.classList.remove("close");
        this.addFunctionality(content, id, contentItem);
      })

      // display watched movies on DOMloaded"
      watchedMovie.forEach(movie => {
        if(Number(content.dataset.id) === movie.id) {
          const watched = content.querySelector(".watched");
          movie.watched ? watched.classList.add("show") : watched.classList.remove("show");
        }
      }) 
    }) 
  }

  setSelections() {

  }

  addFunctionality(content, id, contentItem) {
    const watchedBtn = document.querySelector(".watchedBtn")
    const collectionBtn = document.querySelector(".collectionBtn");
    const watchedMovie = Store.getWatched();
    const collectionContent = [...collectionBody.children]

    collectionContent.forEach(content => {
      if(Number(content.dataset.id) === contentItem.id) {
        collectionBtn.classList.add("collected");
      }
    })

    // style "set watched" button when pop up"
    watchedMovie.forEach(movie => {
      if(Number(content.dataset.id) === movie.id) {
        movie.watched ? watchedBtn.classList.add("watched-movie") : watchedBtn.classList.remove('watched-movie');
      }
    })

    watchedBtn.addEventListener("click", () => {
        watchedBtn.classList.toggle("watched-movie");
        this.setWatched(content, id);
    })
    collectionBtn.addEventListener("click", () => {
      collectionBtn.classList.toggle("collected");
      this.setSelection(id, contentItem, collectionBtn);
      this.mappedCollectionPopup();
    })
  }

  setWatched(content, id) {
    const watchedIcon = content.querySelector(".watched")
    watchedIcon.classList.toggle("show");

    const item = {id : id, watched: watchedIcon.classList.contains("show") ? true : false};

    watchedArr = [...watchedArr, item]

    Store.saveWatched(item, id)
  }
  setSelection(id, contentItem, collectionBtn) {
    const item = {id: id, content: contentItem,  selected: collectionBtn.classList.contains("collected") ? true : false};

    collectionArr = [...collectionArr, item];

    Store.saveCollections(item, id);
  }
}

class Store {
  static saveMovies() {
    localStorage.setItem("movies", JSON.stringify(moviesArr))
  }

  static saveWatched(watchedArr, id) {
    const gotten = Store.getWatched();

    localStorage.setItem("watched", JSON.stringify([...gotten.filter(item => item.id !== id), watchedArr]))
  }

  static getWatched() {
    return localStorage.getItem("watched") ? JSON.parse(localStorage.getItem("watched")): [];
  }

  static saveCollections(collectionArr, id) {
    const gotten = Store.getCollections();

    localStorage.setItem("collections", JSON.stringify([...gotten.filter(item => item.id !== id), collectionArr]))
  }

  static getCollections() {
    return localStorage.getItem("collections") ? JSON.parse(localStorage.getItem("collections")): [];
  }

}

window.addEventListener("DOMContentLoaded", () => {

  const ui = new UI();

  ui.getMovies().then(respData => {
    ui.mapItems(respData);
    ui.mappedCollectionPopup();
    Store.saveMovies(moviesArr);
  }).then(() => {
    ui.movieList()
    // ui.collectionList();
    ui.toggleBtns()
  })
})