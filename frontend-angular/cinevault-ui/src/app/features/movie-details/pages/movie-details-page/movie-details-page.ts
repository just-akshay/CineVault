import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../../../core/services/movie.service';
import { VaultItem, VaultService } from '../../../../core/services/vault-service';
// 1. Import your new Vault Service and Interface

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details-page.html',
  styleUrls: ['./movie-details-page.scss']
})
export class MovieDetailsPageComponent implements OnInit {
  movie: any = null; 
  isSaved: boolean = false;
  cast: any[] = [];
  
  streamProviders: any[] = [];
  rentProviders: any[] = [];
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/original';

  trailerUrl: SafeResourceUrl | null = null;
  showTrailer: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    // 2. Inject the Vault Service here
    private vaultService: VaultService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type') || 'movie'; 
      const id = params.get('id');

      if (id) {
        this.movieService.getDetails(type, id).subscribe({
          next: (data) => {
            this.movie = data;
            
            if (!this.movie?.title && this.movie?.name) {
              this.movie.title = this.movie.name; 
            }

            this.cast = data.credits?.cast?.slice(0, 12) || [];

            const watchData = data['watch/providers']?.results || {};
            const regionData = watchData['IN'] || watchData['US'] || null;

            if (regionData) {
              this.streamProviders = regionData.flatrate || [];
              this.rentProviders = regionData.rent || [];
            } else {
              this.streamProviders = [];
              this.rentProviders = [];
            }

            const videos = data.videos?.results || [];
            const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

            if (trailer) {
              const url = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
              this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            } else {
              this.trailerUrl = null;
            }

            this.checkIfSaved();
            this.cdr.detectChanges(); 
          },
          error: (err) => {
            console.error('Error fetching media details from TMDB:', err);
            this.movie = { 
              title: 'Content Unavailable', 
              overview: 'We were unable to load the details for this item right now.' 
            };
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
  
  // 3. Ask the database if this movie is already saved
  checkIfSaved(): void {
    if (!this.movie) return;
    
    this.vaultService.getVaultItems().subscribe({
      next: (vaultItems) => {
        // Compare the current movie ID against the database IDs
        this.isSaved = vaultItems.some(item => Number(item.id) === Number(this.movie.id));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to verify vault status:', err)
    });
  }

  // 4. Send the data to MySQL instead of LocalStorage!
  toggleVault(): void {
    if (!this.movie) return;
    
    if (this.isSaved) {
      // If it's already saved, tell the Java backend to delete it
      this.vaultService.removeFromVault(this.movie.id).subscribe({
        next: () => {
          this.isSaved = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove from database vault:', err)
      });
    } else {
      // Build a clean VaultItem to send to Java
      // Notice the camelCase keys matching your Java Entity!
      const newItem: VaultItem = {
        id: Number(this.movie.id),
        title: this.movie.title || this.movie.name,
        posterPath: this.movie.poster_path, 
        voteAverage: this.movie.vote_average,
        releaseDate: this.movie.release_date || this.movie.first_air_date,
        mediaType: this.movie.first_air_date ? 'tv' : 'movie'
      };

      // Push it to the backend via POST request
      this.vaultService.addToVault(newItem).subscribe({
        next: () => {
          this.isSaved = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to save to database vault:', err)
      });
    }
  }
}