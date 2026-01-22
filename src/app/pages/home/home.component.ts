import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMovies: Movie[] = [];
  nowShowingMovies: Movie[] = [];
  comingSoonMovies: Movie[] = [];
  loading = true;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        this.featuredMovies = movies.filter(movie => movie.isFeatured);
        this.nowShowingMovies = movies.slice(0, 4);
        this.comingSoonMovies = movies.slice(4, 8);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading movies:', error);
        this.loading = false;
      }
    });
  }

  getGenresString(genres: string[]): string {
    return genres.join(', ');
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }
}