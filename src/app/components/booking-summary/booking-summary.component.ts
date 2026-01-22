import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../services/booking.service';
import { Seat } from '../../models/seat.model';
import { Showtime } from '../../models/showtime.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule,
    MatButtonModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss']
})
export class BookingSummaryComponent implements OnInit {
  selectedSeats: Seat[] = [];
  showtime: Showtime | null = null;
  totalPrice = 0;
  bookingInProgress = false;
  bookingComplete = false;
  bookingCode = '';

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBookingData();
  }

  loadBookingData(): void {
    this.selectedSeats = this.bookingService.getSelectedSeats();
    this.showtime = this.bookingService.getSelectedShowtime();
    
    if (this.selectedSeats.length === 0 || !this.showtime) {
      this.snackBar.open('No booking data found. Please select seats first.', 'OK', { duration: 3000 });
      this.router.navigate(['/movies']);
      return;
    }
    
    this.totalPrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  confirmBooking(): void {
    this.bookingInProgress = true;
    
    setTimeout(() => {
      this.bookingComplete = true;
      this.bookingCode = this.generateBookingCode();
      this.bookingInProgress = false;
      
      this.snackBar.open('Booking confirmed successfully!', 'OK', { duration: 5000 });
    }, 2000);
  }

  generateBookingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  getSeatTypes(): string {
    const types = [...new Set(this.selectedSeats.map(seat => seat.type))];
    return types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
  }

  formatTime(time: string): string {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  printTicket(): void {
    window.print();
  }
}