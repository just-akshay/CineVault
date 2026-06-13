import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card';

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonCardComponent],
  templateUrl: './filter-page.html',
  styleUrls: ['./filter-page.scss']
})
export class FilterPageComponent implements OnInit {
  filteredMovies: Movie[] = [];
  isLoading: boolean = false;
  
  // --- NEW PAGINATION VARIABLE ---
  currentPage: number = 1;

  selectedRating: number = 7.5;
  selectedYear: number = 2020;

  ratingOptions = [8.5, 8.0, 7.5, 7.0, 6.0];
  yearOptions = [2026, 2025, 2024, 2022, 2020, 2015, 2010];

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  // The 'isLoadMore' flag tells us if we are replacing the list or adding to it!
  applyFilters(isLoadMore: boolean = false): void {
    if (!isLoadMore) {
      this.currentPage = 1; // Reset to page 1 if they changed the dropdowns
      this.filteredMovies = []; // Clear the old movies out
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Pass the currentPage to the service!
    this.movieService.getFilteredMovies(this.selectedRating, this.selectedYear, this.currentPage)
      .subscribe({
        next: (movies) => {
          if (isLoadMore) {
            // If loading more, STACK the new movies onto the existing array
            this.filteredMovies = [...this.filteredMovies, ...movies];
          } else {
            // If it's a fresh search, just set the array
            this.filteredMovies = movies;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Discovery filtering failed:", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // --- NEW LOAD MORE BUTTON FUNCTION ---
  loadMore(): void {
    this.currentPage++; // Go to the next page
    this.applyFilters(true); // Call the API but tell it to stack the results
  }

  onRatingChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRating = parseFloat(selectElement.value);
    this.applyFilters();
  }

  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(selectElement.value, 10);
    this.applyFilters(); 
  }
}