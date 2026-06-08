import { Component } from '@angular/core';
import { DUMMY_MOVIES } from '../../../../core/constants/dummy-movies';
import { Movie } from '../../../../core/models/movie.model';
import { Footer } from '../../../../shared/components/footer/footer';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { MovieRow } from '../../components/movie-row/movie-row';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroBanner, MovieRow, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  featuredMovie: Movie = DUMMY_MOVIES[0];

  trendingMovies: Movie[] = DUMMY_MOVIES;
  popularMovies: Movie[] = [...DUMMY_MOVIES].reverse();
  topRatedMovies: Movie[] = DUMMY_MOVIES.filter((movie) => movie.rating >= 8.5);
  upcomingMovies: Movie[] = DUMMY_MOVIES.slice(2);
}