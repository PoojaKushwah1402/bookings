import { v4 as uuid } from 'uuid';
import { httpClient } from '../../../shared/api/httpClient';
import { Booking, BookingRequest, Listing, NewListingInput } from '../types';

type InMemoryDB = {
  listings: Listing[];
  bookings: Booking[];
};

const seedListings: Listing[] = [
  {
    id: uuid(),
    title: 'SoMa Microloft',
    city: 'San Francisco',
    state: 'CA',
    keywords: ['urban', 'wifi', 'walkable'],
    amenities: ['Washer/Dryer', 'Desk', 'Smart Lock'],
    availability: {
      startDate: '2025-01-04',
      endDate: '2025-12-31',
      note: 'Weekday stays only',
    },
  },
  {
    id: uuid(),
    title: 'Cedar Cabin',
    city: 'Bend',
    state: 'OR',
    keywords: ['mountain', 'fireplace', 'quiet'],
    amenities: ['Fire Pit', 'Heated Floors', 'Trail Access'],
    availability: {
      startDate: '2025-02-10',
      endDate: '2025-11-20',
    },
  },
];

const db: InMemoryDB = {
  listings: seedListings,
  bookings: [],
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const bookingService = {
  async getListings(): Promise<Listing[]> {
    return httpClient.get(() => clone(db.listings));
  },

  async getBookings(): Promise<Booking[]> {
    return httpClient.get(() => clone(db.bookings));
  },

  async createListing(input: NewListingInput): Promise<Listing> {
    const listing: Listing = {
      ...input,
      id: uuid(),
    };
    db.listings = [listing, ...db.listings];
    return httpClient.post(() => clone(listing));
  },

  async deleteListing(listingId: string): Promise<void> {
    db.listings = db.listings.filter((listing) => listing.id !== listingId);
    db.bookings = db.bookings.filter((booking) => booking.listingId !== listingId);
    return httpClient.delete(() => undefined);
  },

  async createBooking(input: BookingRequest): Promise<Booking> {
    const listingExists = db.listings.some((listing) => listing.id === input.listingId);
    if (!listingExists) {
      throw new Error('Listing not found');
    }

    const booking: Booking = {
      ...input,
      id: uuid(),
      status: 'confirmed',
    };

    db.bookings = [booking, ...db.bookings];
    return httpClient.post(() => clone(booking));
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const bookingIndex = db.bookings.findIndex((booking) => booking.id === bookingId);
    if (bookingIndex < 0) {
      throw new Error('Booking not found');
    }

    db.bookings[bookingIndex] = {
      ...db.bookings[bookingIndex],
      status: 'cancelled',
    };

    return httpClient.patch(() => clone(db.bookings[bookingIndex]));
  },
};


