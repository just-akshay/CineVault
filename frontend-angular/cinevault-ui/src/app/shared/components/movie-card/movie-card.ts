import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { TMDB_CONFIG } from '../../../core/constants/tmdb.constants';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common'; // <-- 1. Add this import statement
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CommonModule], // <-- 2. Include CommonModule here 
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  imageBaseUrl = TMDB_CONFIG.IMAGE_BASE_URL;

  // Helper method to extract just the year from the release_date string (e.g., "2023-11-22" -> "2023")
  getReleaseYear(dateString: string): string {
    return dateString ? dateString.split('-')[0] : '';
  }

  // Helper method to format the rating to one decimal place
  getFormattedRating(rating: number): string {
    return rating ? rating.toFixed(1) : 'NR';
  }
  getYear(): string {
    const dateString = this.movie.release_date || this.movie.first_air_date;
    return dateString ? dateString.split('-')[0] : 'TBA';
  }
  // This builds a perfectly safe array for Angular's router
  getRouteUrl(): any[] {
    // If the database gave us a media_type (like 'tv'), use it. 
    // If it's missing, safely assume it's a 'movie'.
    const type = this.movie.media_type ? this.movie.media_type : 'movie';
    
    return ['/details', type, this.movie.id];
  }
}