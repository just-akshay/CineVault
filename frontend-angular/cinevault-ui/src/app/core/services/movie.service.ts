import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs'; // Added shareReplay
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
  getMovieDetails(id: number | string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }
}