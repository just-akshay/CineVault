export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  rating: number;
  genres: string[];
}