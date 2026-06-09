import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { VaultService } from '../../../../core/services/vault-service';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vault-page',
  standalone: true,
  imports: [MovieCardComponent, RouterLink],
  templateUrl: './vault-page.html',
  styleUrl: './vault-page.scss',
})
export class VaultPage implements OnInit {
  vaultMovies: Movie[] = [];

  constructor(private vaultService: VaultService) {}

  ngOnInit(): void {
    this.vaultMovies = this.vaultService.getVaultMovies();
  }

  removeMovie(movieId: number): void {
  this.vaultService.removeFromVault(movieId);

  this.vaultMovies =
    this.vaultService.getVaultMovies();
}
}