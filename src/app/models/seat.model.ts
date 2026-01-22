export enum SeatStatus {
  AVAILABLE = 'available',
  SELECTED = 'selected',
  BOOKED = 'booked',
  BLOCKED = 'blocked'
}

export enum SeatType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  RECLINER = 'recliner'
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: SeatType;
  price: number;
}