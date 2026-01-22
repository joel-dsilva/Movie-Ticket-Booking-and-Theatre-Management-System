export interface Showtime {
  id: number;
  movieId: number;
  theatreId: number;
  startTime: string;
  endTime: string;
  date: string;
  screenNumber: number;
  availableSeats: number;
  totalSeats: number;
  price: number;
  format: '2D' | '3D' | 'IMAX' | '4DX';
}