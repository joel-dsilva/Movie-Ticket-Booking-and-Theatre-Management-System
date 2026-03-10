import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="primary">check_circle</mat-icon>
      Booking Confirmed
    </h2>

    <mat-dialog-content>
      <p>Your tickets were booked successfully.</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close color="primary">
        OK
      </button>
    </mat-dialog-actions>
  `
})
export class BookingConfirmationDialogComponent {}