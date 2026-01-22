export interface Booking {
  id: string;
  userId: number;
  movieId: number;
  showtimeId: number;
  theatreId: number;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingCode: string;
  movieTitle?: string;
  theatreName?: string;
  showtimeDate?: string;
}

// Add Seat interface if not already defined in seat.model.ts
export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked' | 'blocked';
  type: 'standard' | 'premium' | 'recliner';
  price: number;
}