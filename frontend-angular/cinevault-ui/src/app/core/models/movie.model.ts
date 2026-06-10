export interface Movie {
  id: number;
  title?: string;          // Used by Movies
  name?: string;           // Used by TV Shows
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;   // Used by Movies
  first_air_date?: string; // Used by TV Shows
  vote_average: number;
  media_type?: string;     // Tells us if it's a 'movie' or 'tv'
}

export interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}