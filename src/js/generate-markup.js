import PostApiService from './post-servise';

const refs = {
  cardList: document.querySelector('.card__list'),
  pagination: document.querySelector('.pagination__list'),
};

const postApiService = new PostApiService();

fetchTrendingPost();

refs.pagination.addEventListener('click', onBtnPagination);

// Pagination control and post current page
function onBtnPagination(e) {
  const { target, currentTarget } = e;

  if (target === currentTarget || target.textContent === '...') {
    return;
  }

  if (target.textContent === '🡺') {
    postApiService.incrementPage();
    fetchTrendingPost();
    return;
  }

  if (target.textContent === '🡸') {
    postApiService.decrementPage();
    fetchTrendingPost();
    return;
  }

  postApiService.pageCurrent = Number(target.textContent);
  fetchTrendingPost(postApiService.pageCurrent);
}

// Fetch Trending Film
function fetchTrendingPost(page = 1) {
  postApiService.fetchTrendingPost().then(data => {
    renderMarkup(data.results);
    pagination(data.page, data.total_pages);
  });
}

// Creating markup
function createMarkup(data) {
  return data.reduce(
    (acc, { poster_path, original_title, genre_ids, release_date }) => {
      // card template markup
      /* <li class="card__item">
          <a class="card__link" href="#">
            <img class="card__img" src="./images/Rectangle1.png" alt="" />
            <h2 class="card__title">
              <span class="card__title--black">GREYHOUND</span>
              Drama, Action | 2020
            </h2>
          </a>
        </li>*/
      acc += `<li class="card__item">
              <a class="card__link" href="#">
                <img class="card__img" src="https://image.tmdb.org/t/p/original${poster_path}" alt="${original_title}" />
                <h2 class="card__title">
                  <span class="card__title--black">${original_title}</span>
                  ${getGenreName(genre_ids)} | ${onlyYearFilter(release_date)}
                </h2>
              </a>
            </li> `;

      return acc;
    },
    ''
  );
}

// Filters the release date only by year
function onlyYearFilter(release_date) {
  return !release_date
    ? 'Unknown Year'
    : release_date.split('').slice(0, 4).join('');
}
// Gets genre names from id
function getGenreName(genre_ids) {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  };

  if (genre_ids.length < 3) {
    return genre_ids.map(elem => genres[elem]).join(', ');
  }
  return (
    genre_ids
      .map(elem => genres[elem])
      .slice(0, 2)
      .join(', ') + ', Others'
  );
}

// Rendering markup
function renderMarkup(data) {
  refs.cardList.innerHTML = createMarkup(data);
}

// Page pagination markup
function pagination(page, pages) {
  let markup = '';
  postApiService.pageCurrent = page;
  const beforeTwoPage = page - 2;
  const beforeOnePage = page - 1;
  const afterTwoPage = page + 2;
  const afterOnePage = page + 1;

  // &#129144; <
  // &#129146; >

  if (page > 1) {
    markup +=
      '<li class="pagination__item pagination__item--arrow">&#129144</li>';
    markup += '<li class="pagination__item">1</li>';
  }
  if (page > 4) {
    markup += '<li class="pagination__item pagination__item--dots">...</li>';
  }
  if (page > 3) {
    markup += `<li class="pagination__item">${beforeTwoPage}</li>`;
  }
  if (page > 2) {
    markup += `<li class="pagination__item">${beforeOnePage}</li>`;
  }
  markup += `<li class="pagination__item pagination__item--current-page">${postApiService.pageCurrent}</li>`;
  if (pages - 1 > postApiService.pageCurrent) {
    markup += `<li class="pagination__item">${afterOnePage}</li>`;
  }
  if (pages - 2 > postApiService.pageCurrent) {
    markup += `<li class="pagination__item">${afterTwoPage}</li>`;
  }
  if (pages - 3 > postApiService.pageCurrent) {
    markup += '<li class="pagination__item pagination__item--dots">...</li>';
  }
  if (pages > postApiService.pageCurrent) {
    markup += `<li class="pagination__item">${pages}</li>`;
    markup += `<li class="pagination__item pagination__item--arrow">&#129146</li>`;
  }

  refs.pagination.innerHTML = markup;
}
