import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'movies', loadComponent: () => import('./components/movie-list/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'movie/:id', loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'movie/:id/showtimes', loadComponent: () => import('./components/showtime-list/showtime-list.component').then(m => m.ShowtimeListComponent) },
  { path: 'showtime/:id/seats', loadComponent: () => import('./components/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent) },
  { path: 'booking-summary', loadComponent: () => import('./components/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent) },
  { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
  { path: '**', redirectTo: '' }
];