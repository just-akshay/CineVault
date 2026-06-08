import { Component, Input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner {
  @Input({ required: true }) movie!: Movie;
}