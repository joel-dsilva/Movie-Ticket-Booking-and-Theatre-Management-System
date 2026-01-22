export interface Theatre {
  id: number;
  name: string;
  location: string;
  city: string;
  facilities: string[];
  screens: number;
  contact: string;
  latitude?: number;
  longitude?: number;
}