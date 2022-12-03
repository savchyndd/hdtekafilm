import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/';
const TRANDING_URL = `${BASE_URL}trending/movie/week`;
const SEARCH_URL = `${BASE_URL}search/movie`;
const API_KEY = '3373af60a4ee1fe7510a1a61c11380e1';

export default class PostApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async fetchPost() {
    const OPTIONS = new URLSearchParams({
      api_key: API_KEY,
      query: this.searchQuery,
      page: this.page,
    });

    try {
      const response = await axios.get(`${SEARCH_URL}?${OPTIONS.toString()}`);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error.toJSON());
    }
  }

  async fetchTrendingPost() {
    const OPTIONS = new URLSearchParams({
      api_key: API_KEY,
      page: this.page,
    });
    try {
      const response = await axios.get(`${TRANDING_URL}?${OPTIONS.toString()}`);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error.toJSON());
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newTotalHits) {
    this.totalHits = newTotalHits;
  }

  get pageCurrent() {
    return this.page;
  }

  set pageCurrent(newPageCurrent) {
    this.page = newPageCurrent;
  }

  incrementPage() {
    this.page += 1;
  }

  decrementPage() {
    this.page -= 1;
  }

  resetPage() {
    this.page = 1;
  }
}
