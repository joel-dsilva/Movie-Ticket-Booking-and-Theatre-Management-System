export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  rating: number;
  genre: string[];
  cast: string[];
  director: string;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  language: string;
  isFeatured?: boolean;
}

export interface MovieFilters {
  genre: string;
  language: string;
  rating: number;
}