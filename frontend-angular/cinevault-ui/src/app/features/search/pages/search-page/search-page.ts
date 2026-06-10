// 1. Import ChangeDetectorRef
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; 
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card'; 
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card';
@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCardComponent, SkeletonCardComponent], 
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.scss']
})
export class SearchPageComponent implements OnInit {
  searchControl = new FormControl(''); 
  searchResults: Movie[] = [];
  isSearching: boolean = false;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef // 2. Inject it here!
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400), 
      distinctUntilChanged(), 
      switchMap(query => {
        this.isSearching = true; 
        this.cdr.detectChanges(); // WAKE UP: Draw the loading spinner!
        
        return this.movieService.searchMovies(query || ''); 
      })
    ).subscribe({
      next: (movies) => {
        this.searchResults = movies;
        this.isSearching = false; 
        this.cdr.detectChanges(); // WAKE UP: Draw the movie posters!
      },
      error: (err) => {
        console.error("Search failed:", err);
        this.isSearching = false;
        this.cdr.detectChanges(); 
      }
    });
  }
}