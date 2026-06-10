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

  // Default filter values
  selectedRating: number = 7.5;
  selectedYear: number = 2020;

  // Options for our dropdowns
  ratingOptions = [8.5, 8.0, 7.5, 7.0, 6.0];
  yearOptions = [2026, 2025, 2024, 2022, 2020, 2015, 2010];

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.applyFilters(); // Run automatically on load with defaults
  }

  applyFilters(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.movieService.getFilteredMovies(this.selectedRating, this.selectedYear)
      .subscribe({
        next: (movies) => {
          this.filteredMovies = movies;
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

  onRatingChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRating = parseFloat(selectElement.value);
    this.applyFilters(); // Instantly update lists
  }

  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(selectElement.value, 10);
    this.applyFilters(); // Instantly update lists
  }
}