import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Theatre } from '../models/theatre.model';
import { Showtime } from '../models/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class TheatreService {
  private mockTheatres: Theatre[] = [
    {
      id: 1,
      name: 'PVR Cinemas',
      location: 'Phoenix Marketcity',
      city: 'Mumbai',
      facilities: ['Dolby Atmos', 'Recliner Seats', 'Food Court', 'Parking'],
      screens: 8,
      contact: '+91 9876543210'
    },
    {
      id: 2,
      name: 'INOX',
      location: 'R City Mall',
      city: 'Mumbai',
      facilities: ['3D Projection', 'Cafe', 'Wheelchair Access'],
      screens: 6,
      contact: '+91 9876543211'
    },
    {
      id: 3,
      name: 'Cinepolis',
      location: 'Viviana Mall',
      city: 'Thane',
      facilities: ['4DX', 'IMAX', 'Lounge', 'Valet Parking'],
      screens: 10,
      contact: '+91 9876543212'
    }
  ];

  private mockShowtimes: Showtime[] = [
    {
      id: 1,
      movieId: 1,
      theatreId: 1,
      startTime: '2024-03-20T18:00:00',
      endTime: '2024-03-20T20:28:00',
      date: '2024-03-20',
      screenNumber: 3,
      availableSeats: 120,
      totalSeats: 150,
      price: 12.99,
      format: 'IMAX'
    },
    {
      id: 2,
      movieId: 1,
      theatreId: 1,
      startTime: '2024-03-20T21:00:00',
      endTime: '2024-03-20T23:28:00',
      date: '2024-03-20',
      screenNumber: 3,
      availableSeats: 140,
      totalSeats: 150,
      price: 12.99,
      format: 'IMAX'
    },
    {
      id: 3,
      movieId: 2,
      theatreId: 2,
      startTime: '2024-03-20T19:30:00',
      endTime: '2024-03-20T22:02:00',
      date: '2024-03-20',
      screenNumber: 2,
      availableSeats: 80,
      totalSeats: 100,
      price: 10.99,
      format: '2D'
    }
  ];

  getTheatres(): Observable<Theatre[]> {
    return of(this.mockTheatres).pipe(delay(500));
  }

  getTheatreById(id: number): Observable<Theatre | undefined> {
    return of(this.mockTheatres.find(theatre => theatre.id === id)).pipe(delay(300));
  }

  getShowtimes(movieId: number, theatreId?: number): Observable<Showtime[]> {
    let filtered = this.mockShowtimes.filter(showtime => showtime.movieId === movieId);
    
    if (theatreId) {
      filtered = filtered.filter(showtime => showtime.theatreId === theatreId);
    }
    
    return of(filtered).pipe(delay(400));
  }

  getShowtimeById(id: number): Observable<Showtime | undefined> {
    return of(this.mockShowtimes.find(showtime => showtime.id === id)).pipe(delay(300));
  }

  getTheatresByMovie(movieId: number): Observable<Theatre[]> {
    const showtimeTheatreIds = this.mockShowtimes
      .filter(showtime => showtime.movieId === movieId)
      .map(showtime => showtime.theatreId);
    
    const uniqueTheatreIds = [...new Set(showtimeTheatreIds)];
    const theatres = this.mockTheatres.filter(theatre => 
      uniqueTheatreIds.includes(theatre.id)
    );
    
    return of(theatres).pipe(delay(400));
  }
}