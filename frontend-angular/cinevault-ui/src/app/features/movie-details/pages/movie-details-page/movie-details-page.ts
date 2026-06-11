import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../../../core/services/movie.service';

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
  
  // Watch Provider streams
  streamProviders: any[] = [];
  rentProviders: any[] = [];
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/original';

  trailerUrl: SafeResourceUrl | null = null;
  showTrailer: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // FIX: If 'type' is missing from the URL, automatically default to 'movie'
      const type = params.get('type') || 'movie'; 
      const id = params.get('id');

      // Now we only need a valid ID to trigger the network fetch!
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
  

  // Temporary local storage stub until your Java Backend is running
checkIfSaved(): void {
    if (!this.movie) return;
    const vault = JSON.parse(localStorage.getItem('cinevault_items') || '[]');
    // FIX: Force both IDs to Numbers so comparison never fails silently
    this.isSaved = vault.some((item: any) => Number(item.id) === Number(this.movie.id));
  }

  toggleVault(): void {
    if (!this.movie) return;
    let vault = JSON.parse(localStorage.getItem('cinevault_items') || '[]');
    
    if (this.isSaved) {
      // FIX: Filter items safely using numeric evaluation
      vault = vault.filter((item: any) => Number(item.id) !== Number(this.movie.id));
      this.isSaved = false;
    } else {
      // Build a clean, uniform object data structure for your Vault Page layout to read
      vault.push({
        id: Number(this.movie.id),
        title: this.movie.title || this.movie.name,
        poster_path: this.movie.poster_path,
        vote_average: this.movie.vote_average,
        release_date: this.movie.release_date || this.movie.first_air_date,
        media_type: this.movie.first_air_date ? 'tv' : 'movie'
      });
      this.isSaved = true;
    }
    
    localStorage.setItem('cinevault_items', JSON.stringify(vault));
    this.cdr.detectChanges();
  }
}