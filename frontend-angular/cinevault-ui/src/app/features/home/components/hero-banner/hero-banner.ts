import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // 1. Import CDR
import { CommonModule } from '@angular/common'; 
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss']
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  @Input() movies: Movie[] = [];
  
  currentIndex: number = 0;
  slideInterval: any;
  highResImageBaseUrl = 'https://image.tmdb.org/t/p/original'; 

  // 2. Inject CDR into the constructor
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges(); // 3. Tell Angular to redraw the new image!
    }, 6000); 
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.stopAutoSlide(); 
    this.startAutoSlide(); 
  }

  getReleaseYear(dateString: string): string {
    return dateString ? dateString.split('-')[0] : '';
  }
}