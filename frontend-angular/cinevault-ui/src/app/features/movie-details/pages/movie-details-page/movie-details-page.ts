import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import CDR
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { VaultService } from '../../../../core/services/vault-service';
import { Movie } from '../../../../core/models/movie.model';
import { TMDB_CONFIG } from '../../../../core/constants/tmdb.constants';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [], 
  templateUrl: './movie-details-page.html',
  styleUrls: ['./movie-details-page.scss']
})
export class MovieDetailsPageComponent implements OnInit {
  movie: Movie | null = null; 
  isSaved: boolean = false;
  
  imageBaseUrl = TMDB_CONFIG.IMAGE_BASE_URL;
  highResImageBaseUrl = 'https://image.tmdb.org/t/p/original';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private vaultService: VaultService,
    private cdr: ChangeDetectorRef // 2. Inject it here
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // 3. Updated subscription to handle success, trigger redraw, and catch errors
      this.movieService.getMovieDetails(id).subscribe({
        next: (data) => {
          this.movie = data;
          this.checkIfSaved();
          this.cdr.detectChanges(); // 4. WAKE UP AND REDRAW!
        },
        error: (err) => {
          console.error("Failed to fetch movie details from TMDB:", err);
        }
      });
    }
  }

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

  getReleaseYear(dateString: string | undefined): string {
    return dateString ? dateString.split('-')[0] : 'TBA';
  }
}