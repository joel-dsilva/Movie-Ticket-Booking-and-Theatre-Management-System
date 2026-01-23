import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../services/movie.service';
import { TheatreService } from '../../services/theatre.service';
import { Movie } from '../../models/movie.model';
import { Showtime } from '../../models/showtime.model';
import { Theatre } from '../../models/theatre.model';

@Component({
  selector: 'app-showtime-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './showtime-list.component.html',
  styleUrls: ['./showtime-list.component.scss']
})
export class ShowtimeListComponent implements OnInit {
  movieId!: number;
  movie: Movie | null = null;
  showtimes: Showtime[] = [];
  theatres: Theatre[] = [];
  filteredShowtimes: Showtime[] = [];

  selectedTheatre: string = 'all';
  selectedFormat: string = 'all';
  selectedDate: string = '';

  loading = true;
  dates: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private theatreService: TheatreService
  ) {}

  ngOnInit(): void {
    this.generateDates();

    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      this.loadData();
    });
  }

  generateDates(): void {
    const today = new Date();
    this.dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.dates.push(date.toISOString().split('T')[0]);
    }

    this.selectedDate = this.dates[0];
  }

  loadData(): void {
    this.loading = true;

    this.movieService.getMovieById(this.movieId).subscribe(movie => {
      this.movie = movie || null;
    });

    this.theatreService.getShowtimes(this.movieId).subscribe(showtimes => {
      this.showtimes = showtimes;
      this.extractTheatres(showtimes);
      this.filterShowtimes();
      this.loading = false;
    });
  }

  extractTheatres(showtimes: Showtime[]): void {
    this.theatres = [];
    const theatreIds = [...new Set(showtimes.map(s => s.theatreId))];

    theatreIds.forEach(id => {
      this.theatreService.getTheatreById(id).subscribe(theatre => {
        if (theatre) {
          this.theatres.push(theatre);
        }
      });
    });
  }

  filterShowtimes(): void {
    this.filteredShowtimes = this.showtimes.filter(showtime => {
      const matchesTheatre =
        this.selectedTheatre === 'all' || showtime.theatreId === +this.selectedTheatre;

      const matchesFormat =
        this.selectedFormat === 'all' || showtime.format === this.selectedFormat;

      const matchesDate = showtime.date === this.selectedDate;

      return matchesTheatre && matchesFormat && matchesDate;
    });
  }

  onFilterChange(): void {
    this.filterShowtimes();
  }

  bookShowtime(showtimeId: number): void {
    this.router.navigate(['/showtime', showtimeId, 'seats']);
  }

  // 🔥 FIXED: supports "HH:mm" and ISO datetime
  formatTime(time: string): string {
    if (!time) return '';

    // If backend sends "HH:mm"
    if (time.includes(':') && time.length <= 5) {
      const [h, m] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m, 0);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // If backend sends ISO string
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFormats(): string[] {
    return [...new Set(this.showtimes.map(s => s.format))];
  }

  getTheatreName(theatreId: number): string {
    return this.theatres.find(t => t.id === theatreId)?.name || 'Unknown';
  }
}
