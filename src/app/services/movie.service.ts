import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesUrl = 'api/movies';
  
  // Mock data for development
  private mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      duration: 148,
      rating: 8.8,
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
      director: 'Christopher Nolan',
      releaseDate: '2010-07-16',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      language: 'English',
      isFeatured: true
    },
    {
      id: 2,
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc on Gotham City.',
      duration: 152,
      rating: 9.0,
      genre: ['Action', 'Crime', 'Drama'],
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      director: 'Christopher Nolan',
      releaseDate: '2008-07-18',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
      language: 'English',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      duration: 169,
      rating: 8.6,
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      director: 'Christopher Nolan',
      releaseDate: '2014-11-07',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      language: 'English',
      isFeatured: false
    }
  ];

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    // In real app: return this.http.get<Movie[]>(this.moviesUrl);
    return of(this.mockMovies).pipe(delay(500));
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    // return this.http.get<Movie>(`${this.moviesUrl}/${id}`);
    return of(this.mockMovies.find(movie => movie.id === id)).pipe(delay(300));
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return of(this.mockMovies.filter(movie => movie.isFeatured)).pipe(delay(300));
  }

  searchMovies(query: string): Observable<Movie[]> {
    const lowerQuery = query.toLowerCase();
    return of(this.mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.genre.some(g => g.toLowerCase().includes(lowerQuery))
    )).pipe(delay(400));
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    return of(this.mockMovies.filter(movie => 
      movie.genre.includes(genre)
    )).pipe(delay(400));
  }
}