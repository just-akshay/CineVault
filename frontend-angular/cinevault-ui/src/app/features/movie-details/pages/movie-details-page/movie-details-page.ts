import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../../../core/services/movie.service';
import { VaultService } from '../../../../core/services/vault-service';
import { TMDB_CONFIG } from '../../../../core/constants/tmdb.constants';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [], 
  templateUrl: './movie-details-page.html',
  styleUrls: ['./movie-details-page.scss']
})
export class MovieDetailsPageComponent implements OnInit {
  movie: any = null; 
  isSaved: boolean = false;
  cast: any[] = [];
  trailerUrl: SafeResourceUrl | null = null;
  showTrailer: boolean = false;
  streamProviders: any[] = [];
  rentProviders: any[] = [];
  imageBaseUrl = TMDB_CONFIG.IMAGE_BASE_URL;
  highResImageBaseUrl = 'https://image.tmdb.org/t/p/original';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private vaultService: VaultService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer 
  ) {}

ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type') || 'movie';
    
    
    if (id) {
      this.movieService.getDetails(type, id).subscribe({
        next: (data) => {
          this.movie = data;
          
          if (!this.movie?.title && this.movie?.name) {
            this.movie.title = this.movie.name; 
          }

          this.cast = data.credits?.cast?.slice(0, 12) || [];

          // --- 2. EXTRACT WATCH PROVIDERS ---
          // Accessing via bracket notation because of the forward slash in the key name
          const watchData = data['watch/providers']?.results || {};
          
          // Target your regional node ('IN' for India) or fall back to 'US' if missing
          const regionData = watchData['IN'] || watchData['US'] || null;

          if (regionData) {
            this.streamProviders = regionData.flatrate || []; // Subscription platforms
            this.rentProviders = regionData.rent || [];         // On-demand transactional platforms
          } else {
            this.streamProviders = [];
            this.rentProviders = [];
          }

          // 3. Keep your existing trailer resolution setup
          const videos = data.videos?.results || [];
          const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

          if (trailer) {
            const url = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }

          this.checkIfSaved();
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error(err)
      });
    }
    
  }

  // --- VAULT METHODS (Restored!) ---
  checkIfSaved(): void {
    if (this.movie) {
      this.isSaved = this.vaultService.isInVault(this.movie.id);
    }
  }

  toggleVault(): void {
    if (this.movie) {
      if (this.isSaved) {
        this.vaultService.removeFromVault(this.movie.id);
      } else {
        this.vaultService.addToVault(this.movie);
      }
      this.isSaved = !this.isSaved;
    }
  }

  // --- HELPER METHODS (Restored!) ---
  getReleaseYear(dateString: string | undefined): string {
    return dateString ? dateString.split('-')[0] : 'TBA';
  }

  // --- TRAILER MODAL METHODS ---
  openTrailer(): void {
    this.showTrailer = true;
  }

  closeTrailer(): void {
    this.showTrailer = false;
  }
}