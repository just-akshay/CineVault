import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner';
import { MovieRow } from '../../components/movie-row/movie-row';
import { Footer } from '../../../../shared/components/footer/footer'; 

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent, MovieRow, Footer], 
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePageComponent implements OnInit {
  featuredMovie: Movie[] = [];
  
  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef // 2. Inject it into the constructor
  ) {}

  ngOnInit(): void {
    this.movieService.getTrendingMovies().subscribe(movies => {
  this.trendingMovies = movies;
  if (movies && movies.length > 0) {
    this.featuredMovie = movies.slice(0, 5); // Grab the top 5 movies!
  }
  this.cdr.detectChanges(); 
});

    this.movieService.getPopularMovies().subscribe(movies => {
      this.popularMovies = movies;
      this.cdr.detectChanges(); // Redraw!
    });

    this.movieService.getTopRatedMovies().subscribe(movies => {
      this.topRatedMovies = movies;
      this.cdr.detectChanges(); // Redraw!
    });

    this.movieService.getUpcomingMovies().subscribe(movies => {
      this.upcomingMovies = movies;
      this.cdr.detectChanges(); // Redraw!
    });
  }
}