import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../models/movie.model';

@Pipe({
  name: 'movieFilter',
  standalone: true
})
export class MovieFilterPipe implements PipeTransform {

  transform(movies: Movie[], genre: string, language: string, rating: number): Movie[] {

    if (!movies) return [];

    return movies.filter(movie => {

      const matchesGenre =
        !genre || movie.genre.includes(genre);

      const matchesLanguage =
        !language || movie.language === language;

      const matchesRating =
        !rating || movie.rating >= rating;

      return matchesGenre && matchesLanguage && matchesRating;

    });

  }
}