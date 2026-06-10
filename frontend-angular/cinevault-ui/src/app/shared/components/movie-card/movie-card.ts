import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { TMDB_CONFIG } from '../../../core/constants/tmdb.constants';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
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
}