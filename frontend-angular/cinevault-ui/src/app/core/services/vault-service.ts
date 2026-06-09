import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

const VAULT_STORAGE_KEY = 'cinevault_vault';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  getVaultMovies(): Movie[] {
    const storedMovies = localStorage.getItem(VAULT_STORAGE_KEY);

    if (!storedMovies) {
      return [];
    }

    return JSON.parse(storedMovies) as Movie[];
  }

  addToVault(movie: Movie): void {
    const currentVault = this.getVaultMovies();
    const movieAlreadyExists = currentVault.some(
      (vaultMovie) => vaultMovie.id === movie.id
    );

    if (movieAlreadyExists) {
      return;
    }

    const updatedVault = [...currentVault, movie];
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updatedVault));
  }

  removeFromVault(movieId: number): void {
    const currentVault = this.getVaultMovies();
    const updatedVault = currentVault.filter((movie) => movie.id !== movieId);

    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updatedVault));
  }

  isMovieInVault(movieId: number): boolean {
    return this.getVaultMovies().some((movie) => movie.id === movieId);
  }
}