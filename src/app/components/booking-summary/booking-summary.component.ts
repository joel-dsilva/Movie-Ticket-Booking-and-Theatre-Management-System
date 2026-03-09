import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BookingConfirmationDialogComponent } from '../booking-confirmation-dialog/booking-confirmation-dialog.component';

import { BookingService } from '../../services/booking.service';
import { Seat } from '../../models/seat.model';
import { Showtime } from '../../models/showtime.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
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

  bookingForm!: FormGroup;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.loadBookingData();

    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });

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

    if (this.bookingForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'OK', { duration: 3000 });
      return;
    }

    this.bookingInProgress = true;

    setTimeout(() => {

      this.bookingComplete = true;
      this.bookingCode = this.generateBookingCode();
      this.bookingInProgress = false;

      this.dialog.open(BookingConfirmationDialogComponent);

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

    return types
      .map(t => t.charAt(0).toUpperCase() + t.slice(1))
      .join(', ');

  }

  formatTime(time: string): string {

    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

  }

  printTicket(): void {

  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text('CineBook Movie Ticket', 20, 20);

  pdf.setFontSize(12);

  pdf.text(`Booking Code: ${this.bookingCode}`, 20, 40);

  if (this.showtime) {

    pdf.text(`Format: ${this.showtime.format}`, 20, 50);

    pdf.text(
      `Showtime: ${this.formatTime(this.showtime.startTime)}`,
      20,
      60
    );

    pdf.text(`Screen: ${this.showtime.screenNumber}`, 20, 70);

  }

  const seats = this.selectedSeats.map(seat => seat.id).join(', ');

  pdf.text(`Seats: ${seats}`, 20, 80);

  pdf.text(`Total Paid: $${this.totalPrice.toFixed(2)}`, 20, 90);

  pdf.text('Enjoy your movie!', 20, 110);

  pdf.save(`ticket-${this.bookingCode}.pdf`);

}

}