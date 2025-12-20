import { httpClient } from '../../../shared/api/httpClient';
import { Booking, BookingRequest, Listing, NewListingInput } from '../types';

const withToken = (token?: string) => (token ? token : undefined);

export const bookingService = {
  async getListings(token?: string): Promise<Listing[]> {
    return httpClient.get<Listing[]>('/listings', withToken(token));
  },

  async getBookings(token?: string): Promise<Booking[]> {
    return httpClient.get<Booking[]>('/bookings', withToken(token));
  },

  async createListing(input: NewListingInput, token?: string): Promise<Listing> {
    return httpClient.post<Listing>('/listings', input, withToken(token));
  },

  async deleteListing(listingId: string, token?: string): Promise<void> {
    await httpClient.delete<void>(`/listings/${listingId}`, withToken(token));
  },

  async createBooking(input: BookingRequest, token?: string): Promise<Booking> {
    return httpClient.post<Booking>('/bookings', input, withToken(token));
  },

  async cancelBooking(bookingId: string, token?: string): Promise<Booking> {
    return httpClient.patch<Booking>(`/bookings/${bookingId}/cancel`, {}, withToken(token));
  },

  async confirmBooking(bookingId: string, token?: string): Promise<Booking> {
    return httpClient.patch<Booking>(`/bookings/${bookingId}/confirm`, {}, withToken(token));
  },
};


