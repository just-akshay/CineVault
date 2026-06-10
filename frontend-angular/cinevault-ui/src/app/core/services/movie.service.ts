import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay,of } from 'rxjs'; // Added shareReplay
import { TMDB_CONFIG } from '../constants/tmdb.constants';
import { Movie, TmdbResponse } from '../models/movie.model';

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
  constructor(private http: HttpClient) {}

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
    // We added &append_to_response=videos to the end of the URL!
    return this.http.get<any>(`${this.apiUrl}/${type}/${id}?api_key=${this.apiKey}&append_to_response=videos`);
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
}