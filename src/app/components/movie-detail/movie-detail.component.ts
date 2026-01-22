import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { TheatreService } from '../../services/theatre.service';
import { Movie } from '../../models/movie.model';
import { Theatre } from '../../models/theatre.model';
import { Showtime } from '../../models/showtime.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  theatres: Theatre[] = [];
  showtimes: Showtime[] = [];
  loading = true;
  error = false;
  
  selectedTheatreId: number | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  
  dates: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private theatreService: TheatreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateDates();
    this.loadMovie();
  }

  generateDates(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.dates.push(date.toISOString().split('T')[0]);
    }
  }

  loadMovie(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(movieId)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.movieService.getMovieById(movieId).subscribe({
      next: (movie) => {
        if (movie) {
          this.movie = movie;
          this.loadTheatres(movieId);
          this.loadShowtimes(movieId);
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movie:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadTheatres(movieId: number): void {
    this.theatreService.getTheatresByMovie(movieId).subscribe({
      next: (theatres) => {
        this.theatres = theatres;
        if (theatres.length > 0 && !this.selectedTheatreId) {
          this.selectedTheatreId = theatres[0].id;
        }
      },
      error: (error) => console.error('Error loading theatres:', error)
    });
  }

  loadShowtimes(movieId: number): void {
    this.theatreService.getShowtimes(movieId).subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes;
      },
      error: (error) => console.error('Error loading showtimes:', error)
    });
  }

  openTrailer(): void {
    if (this.movie?.trailerUrl) {
      // Simple window open for trailer (remove dialog if causing issues)
      window.open(this.movie.trailerUrl, '_blank');
    }
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(timeStr: string): string {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getShowtimesForTheatre(theatreId: number): Showtime[] {
    return this.showtimes.filter(showtime => 
      showtime.theatreId === theatreId && 
      showtime.date === this.selectedDate
    );
  }

  selectTheatre(theatreId: number): void {
    this.selectedTheatreId = theatreId;
  }

  selectDate(date: string): void {
    this.selectedDate = date;
  }

  bookShowtime(showtimeId: number): void {
    this.router.navigate(['/showtime', showtimeId, 'seats']);
  }
}