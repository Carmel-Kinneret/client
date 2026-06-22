export type Category = 'Restaurants' | 'Cafes' | 'Attractions' | 'Parking' | 'Other';

export interface LocationPoint {
  id: string;
  title: string;
  description?: string;
  category: Category;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}
