import { Component } from '@angular/core';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { MovieRow } from '../../components/movie-row/movie-row';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroBanner, MovieRow, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}