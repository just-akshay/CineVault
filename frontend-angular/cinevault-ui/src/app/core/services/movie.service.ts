import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http'; 
import { Observable, map, shareReplay,of } from 'rxjs'; // Added shareReplay
import { TMDB_CONFIG } from '../constants/tmdb.constants';
import { Movie, TmdbResponse } from '../models/movie.model';
import { HttpParams } from '@angular/common/http'; // Make sure this is imported at the top 

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  private apiUrl = TMDB_CONFIG.BASE_URL;
  private apiKey = TMDB_CONFIG.API_KEY;

  // We create variables to hold our cached data
  private trendingCache$!: Observable<Movie[]>;
  private popularCache$!: Observable<Movie[]>;
  private topRatedCache$!: Observable<Movie[]>;
  private upcomingCache$!: Observable<Movie[]>;

  private trendingTvCache$!: Observable<Movie[]>;
  private popularTvCache$!: Observable<Movie[]>;
  private localBackendUrl = 'http://localhost:8080/api/vibe';
  constructor(private http: HttpClient) {}

  searchByVibe(vibe: string): Observable<any> {
  // 1. The URL must include the full path: /api/vibe/search
  // 2. You must pass an OBJECT { vibe: ... } to match the @RequestBody Map in Java
  return this.http.post('http://localhost:8080/api/vibe/search', { vibe: vibe }, { responseType: 'text' });
}

  discoverMoviesByFilters(filters: any): Observable<any> {
    // 1. ⚠️ REPLACE THIS STRING WITH YOUR REAL 32-CHARACTER TMDB KEY
    const tmdbApiKey = '2c82ce7a1725b7245e0fb2dacdd019ba'; 

    let params = new HttpParams().set('api_key', tmdbApiKey);

    if (filters.with_genres) {
      params = params.set('with_genres', filters.with_genres);
    }
    if (filters.primary_release_year) {
      params = params.set('primary_release_year', filters.primary_release_year);
    }
    params = params.set('sort_by', 'popularity.desc');

    // 2. Build the exact query string
    const queryString = params.toString();
    
    // 3. Combine it normally WITHOUT encodeURIComponent
    const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?${queryString}`;
    const finalUrl = `https://corsproxy.io/?${tmdbUrl}`;

    return this.http.get(finalUrl);
  }

  getTrendingMovies(): Observable<Movie[]> {
    if (!this.trendingCache$) {
      this.trendingCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/trending/movie/week?api_key=${this.apiKey}`)
        .pipe(map(response => response.results), shareReplay(1)); // Saves the result in memory!
    }
    return this.trendingCache$;
  }

  getPopularMovies(): Observable<Movie[]> {
    if (!this.popularCache$) {
      this.popularCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`)
        .pipe(map(response => response.results), shareReplay(1));
    }
    return this.popularCache$;
  }

  getTopRatedMovies(): Observable<Movie[]> {
    if (!this.topRatedCache$) {
      this.topRatedCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}`)
        .pipe(map(response => response.results), shareReplay(1));
    }
    return this.topRatedCache$;
  }

  getUpcomingMovies(): Observable<Movie[]> {
    if (!this.upcomingCache$) {
      this.upcomingCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}`)
        .pipe(map(response => response.results), shareReplay(1));
    }
    return this.upcomingCache$;
  }

  // --- NEW: For the Movie Details Page ---
  // Change getMovieDetails to this more flexible getDetails method:
  getDetails(type: string, id: number | string): Observable<any> {
    // We appended ,watch/providers to the end of our optimization chain!
    return this.http.get<any>(`${this.apiUrl}/${type}/${id}?api_key=${this.apiKey}&append_to_response=videos,credits,watch/providers`);
  }

// Searches TMDB for Movies AND TV Shows
  searchMovies(query: string): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]); 
    }
    
    // 1. Changed /search/movie to /search/multi
    return this.http.get<TmdbResponse>(`${this.apiUrl}/search/multi?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`)
      .pipe(map(response => {
        // 2. Filter out 'person' results, keep only 'movie' and 'tv'
        return response.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      }));
  }
  getTrendingTvShows(): Observable<Movie[]> {
    if (!this.trendingTvCache$) {
      this.trendingTvCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/trending/tv/week?api_key=${this.apiKey}`)
        .pipe(
          // Manually stamp 'tv' onto every result so the Details page knows what to fetch
          map(response => response.results.map(show => ({ ...show, media_type: 'tv' }))),
          shareReplay(1)
        );
    }
    return this.trendingTvCache$;
  }

  getPopularTvShows(): Observable<Movie[]> {
    if (!this.popularTvCache$) {
      this.popularTvCache$ = this.http.get<TmdbResponse>(`${this.apiUrl}/tv/popular?api_key=${this.apiKey}`)
        .pipe(
          map(response => response.results.map(show => ({ ...show, media_type: 'tv' }))),
          shareReplay(1)
        );
    }
    return this.popularTvCache$;
  }
  // Advanced discovery engine
 getFilteredMovies(minRating: number, minYear: number, page: number = 1): Observable<Movie[]> {
    const url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}` +
                `&vote_average.gte=${minRating}` +
                `&primary_release_date.gte=${minYear}-01-01` +
                `&vote_count.gte=200` + // Ensures crowd consensus
                `&sort_by=popularity.desc` + // Puts the best known titles first
                `&page=${page}`; // <-- The magic pagination parameter!

    return this.http.get<TmdbResponse>(url).pipe(
      map(response => response.results.map(movie => ({ ...movie, media_type: 'movie' })))
    );
  }
}