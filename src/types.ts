/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyType = 
  | 'House' 
  | 'Apartment' 
  | 'Luxury Mansion' 
  | 'Kitnet' 
  | 'Land' 
  | 'Commercial' 
  | 'Farm' 
  | 'Beach House';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  price: number; // in Millions of USD
  formattedPrice: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  area: string; // e.g., "650 m²"
  image: string;
  gallery: string[];
  description: string;
  features: string[]; // e.g., ["Swimming Pool", "Garden", "Ocean View", "Pet Friendly", "Wine Cellar", "Private Helipad"]
  hasSwimmingPool: boolean;
  hasGarden: boolean;
  hasOceanView: boolean;
  isPetFriendly: boolean;
  tagline: string;
  architect?: string;
  yearBuilt?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
}

export interface Lifestyle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tagline: string;
}
