import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Seat, SeatStatus, SeatType } from '../../models/seat.model';
import { Showtime } from '../../models/showtime.model';
import { BookingService } from '../../services/booking.service';
import { TheatreService } from '../../services/theatre.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {
  showtimeId!: number;
  showtime: Showtime | null = null;
  seats: Seat[][] = [];
  selectedSeats: Seat[] = [];
  totalPrice = 0;
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  seatsPerRow = 10;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private theatreService: TheatreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.showtimeId = +params['id'];
      this.loadShowtime();
      this.generateSeats();
    });
  }

  loadShowtime(): void {
    this.theatreService.getShowtimeById(this.showtimeId).subscribe(showtime => {
      this.showtime = showtime || null;
    });
  }

  generateSeats(): void {
    for (let i = 0; i < this.rows.length; i++) {
      const row: Seat[] = [];
      for (let j = 1; j <= this.seatsPerRow; j++) {
        const type = i < 3 ? SeatType.STANDARD : i < 6 ? SeatType.PREMIUM : SeatType.RECLINER;
        const price = this.getSeatPrice(type);
        const status = Math.random() > 0.8 ? SeatStatus.BOOKED : SeatStatus.AVAILABLE;
        
        row.push({
          id: `${this.rows[i]}${j}`,
          row: this.rows[i],
          number: j,
          type,
          price,
          status
        });
      }
      this.seats.push(row);
    }
  }

  getSeatPrice(type: SeatType): number {
    const base = 12.99;
    switch(type) {
      case SeatType.PREMIUM: return base * 1.5;
      case SeatType.RECLINER: return base * 2;
      default: return base;
    }
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === SeatStatus.BOOKED) return;
    
    if (seat.status === SeatStatus.SELECTED) {
      seat.status = SeatStatus.AVAILABLE;
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (this.selectedSeats.length >= 8) {
        this.snackBar.open('Max 8 seats per booking', 'OK', { duration: 3000 });
        return;
      }
      seat.status = SeatStatus.SELECTED;
      this.selectedSeats.push(seat);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  getSeatClass(seat: Seat): string {
    return `seat ${seat.type} ${seat.status}`;
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.snackBar.open('Please select at least one seat', 'OK', { duration: 3000 });
      return;
    }
    
    if (this.showtime) {
      this.bookingService.setSelectedSeats(this.selectedSeats);
      this.bookingService.setSelectedShowtime(this.showtime);
      this.router.navigate(['/booking-summary']);
    }
  }
}