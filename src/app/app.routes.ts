import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { ShowtimeListComponent } from './components/showtime-list/showtime-list.component';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'movies',
    component: MovieListComponent
  },

  {
    path: 'movie/:id',
    component: MovieDetailComponent,
    children: [
      {
        path: 'showtimes',
        component: ShowtimeListComponent
      }
    ]
  },

  // LOGIN REQUIRED
  {
    path: 'showtime/:id/seats',
    component: SeatSelectionComponent,
    canActivate: [authGuard]
  },

  // LOGIN REQUIRED
  {
    path: 'booking-summary',
    component: BookingSummaryComponent,
    canActivate: [authGuard]
  },

  // LOGIN REQUIRED
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];