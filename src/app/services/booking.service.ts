import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { Seat } from '../models/seat.model';
import { Showtime } from '../models/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedSeatsSubject = new BehaviorSubject<Seat[]>([]);
  private selectedShowtimeSubject = new BehaviorSubject<Showtime | null>(null);
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);

  selectedSeats$ = this.selectedSeatsSubject.asObservable();
  selectedShowtime$ = this.selectedShowtimeSubject.asObservable();
  bookings$ = this.bookingsSubject.asObservable();

  // Mock bookings
  private mockBookings: Booking[] = [
    {
      id: 'BK001',
      userId: 1,
      movieId: 1,
      showtimeId: 1,
      theatreId: 1,
      seats: [
        { id: 'A5', row: 'A', number: 5, status: 'booked', type: 'standard', price: 12.99 },
        { id: 'A6', row: 'A', number: 6, status: 'booked', type: 'standard', price: 12.99 }
      ],
      totalAmount: 25.98,
      bookingDate: '2024-03-15T18:30:00',
      paymentStatus: 'completed',
      bookingCode: 'ABC123XYZ',
      movieTitle: 'Inception',
      theatreName: 'PVR Cinemas',
      showtimeDate: '2024-03-20T18:00:00'
    }
  ];

  constructor() {
    this.bookingsSubject.next(this.mockBookings);
  }

  setSelectedSeats(seats: Seat[]): void {
    this.selectedSeatsSubject.next(seats);
  }

  setSelectedShowtime(showtime: Showtime): void {
    this.selectedShowtimeSubject.next(showtime);
  }

  getSelectedSeats(): Seat[] {
    return this.selectedSeatsSubject.value;
  }

  getSelectedShowtime(): Showtime | null {
    return this.selectedShowtimeSubject.value;
  }

  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    const newBooking: Booking = {
      id: `BK${String(this.bookingsSubject.value.length + 1).padStart(3, '0')}`,
      userId: 1,
      movieId: bookingData.movieId || 0,
      showtimeId: bookingData.showtimeId || 0,
      theatreId: bookingData.theatreId || 0,
      seats: bookingData.seats || [],
      totalAmount: bookingData.totalAmount || 0,
      bookingDate: new Date().toISOString(),
      paymentStatus: 'completed',
      bookingCode: this.generateBookingCode(),
      ...bookingData
    };

    const updatedBookings = [...this.bookingsSubject.value, newBooking];
    this.bookingsSubject.next(updatedBookings);
    
    // Clear selection after booking
    this.selectedSeatsSubject.next([]);
    this.selectedShowtimeSubject.next(null);

    return of(newBooking).pipe(delay(800));
  }

  getBookings(): Observable<Booking[]> {
    return this.bookings$;
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    const booking = this.bookingsSubject.value.find(b => b.id === id);
    return of(booking).pipe(delay(300));
  }

  private generateBookingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}