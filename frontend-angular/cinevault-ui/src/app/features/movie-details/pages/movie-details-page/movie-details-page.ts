import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DUMMY_MOVIES } from '../../../../core/constants/dummy-movies';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-details-page.html',
  styleUrl: './movie-details-page.scss',
})
export class MovieDetailsPage {
  movie: Movie | undefined;

  constructor(private readonly route: ActivatedRoute) {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movie = DUMMY_MOVIES.find((movie) => movie.id === movieId);
  }
}