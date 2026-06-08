import { Component, Input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-row.html',
  styleUrl: './movie-row.scss',
})
export class MovieRow {
  @Input({ required: true }) title = '';
  @Input({ required: true }) movies: Movie[] = [];
}