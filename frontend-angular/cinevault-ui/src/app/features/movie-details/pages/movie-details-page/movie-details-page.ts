import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DUMMY_MOVIES } from '../../../../core/constants/dummy-movies';
import { Movie } from '../../../../core/models/movie.model';
import { VaultService } from '../../../../core/services/vault-service';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-details-page.html',
  styleUrl: './movie-details-page.scss',
})
export class MovieDetailsPage {
  movie: Movie | undefined;
  isInVault = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vaultService: VaultService
  ) {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movie = DUMMY_MOVIES.find((movie) => movie.id === movieId);

    if (this.movie) {
      this.isInVault = this.vaultService.isMovieInVault(this.movie.id);
    }
  }

  addToVault(): void {
    if (!this.movie) {
      return;
    }

    this.vaultService.addToVault(this.movie);
    this.isInVault = true;
  }
}