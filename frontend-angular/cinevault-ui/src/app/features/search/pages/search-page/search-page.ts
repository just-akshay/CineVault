import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DUMMY_MOVIES } from '../../../../core/constants/dummy-movies';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [FormsModule, MovieCardComponent],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  searchTerm = '';

  get filteredMovies(): Movie[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return DUMMY_MOVIES;
    }

    return DUMMY_MOVIES.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedSearchTerm)
    );
  }
}