import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VaultService } from '../../../../core/services/vault-service';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card'; 

@Component({
  selector: 'app-vault-page',
  standalone: true,
  // Make sure the MovieCard is imported!
  imports: [CommonModule, RouterLink, MovieCardComponent], 
  templateUrl: './vault-page.html',
  styleUrls: ['./vault-page.scss']
})
export class VaultPageComponent implements OnInit {
  savedMovies: Movie[] = [];

  constructor(private vaultService: VaultService) {}

  ngOnInit(): void {
    // Load the movies from local storage when the page opens
    this.savedMovies = this.vaultService.getVaultMovies();
  }
}