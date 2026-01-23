import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  loading = true;
  
  // Filters
  searchQuery = '';
  selectedGenre = '';
  selectedLanguage = '';
  minRating = 0;
  
  // Pagination
  pageSize = 8;
  pageIndex = 0;
  pageSizeOptions = [8, 12, 24];
  
  // Available filters
  genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Thriller', 'Adventure', 'Romance'];
  languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];
  ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.filterMovies();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.loading = false;
      }
    });
  }

  filterMovies(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = this.searchQuery === '' || 
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesGenre = this.selectedGenre === '' || 
        movie.genre.includes(this.selectedGenre);
      
      const matchesLanguage = this.selectedLanguage === '' || 
        movie.language === this.selectedLanguage;
      
      const matchesRating = movie.rating >= this.minRating;
      
      return matchesSearch && matchesGenre && matchesLanguage && matchesRating;
    });
    
    this.pageIndex = 0; // Reset to first page on filter
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedLanguage = '';
    this.minRating = 0;
    this.filterMovies();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedMovies(): Movie[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredMovies.slice(startIndex, startIndex + this.pageSize);
  }

  viewMovieDetails(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }

  bookTickets(movieId: number): void {
    this.router.navigate(['/movie', movieId, 'showtimes']);
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }
}