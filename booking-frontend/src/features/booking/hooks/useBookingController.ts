import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingRequest, Listing, NewListingInput } from '../types';

type BusyState = {
  addListing: boolean;
  createBooking: boolean;
  cancelBookingId: string;
};

type BookingController = {
  listings: Listing[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  busy: BusyState;
  addListing: (input: NewListingInput) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  createBooking: (input: BookingRequest) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
};

const initialBusy: BusyState = {
  addListing: false,
  createBooking: false,
  cancelBookingId: '',
};

export const useBookingController = (): BookingController => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<BusyState>(initialBusy);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listingData, bookingData] = await Promise.all([
        bookingService.getListings(),
        bookingService.getBookings(),
      ]);
      setListings(listingData);
      setBookings(bookingData);
    } catch (err) {
      setError('Unable to load booking workspace.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const addListing = useCallback(async (input: NewListingInput) => {
    setError(null);
    setBusy((state) => ({ ...state, addListing: true }));
    try {
      const created = await bookingService.createListing(input);
      setListings((current) => [created, ...current]);
    } catch (err) {
      setError('Could not save listing.');
    } finally {
      setBusy((state) => ({ ...state, addListing: false }));
    }
  }, []);

  const deleteListing = useCallback(async (id: string) => {
    setError(null);
    try {
      await bookingService.deleteListing(id);
      setListings((current) => current.filter((listing) => listing.id !== id));
      setBookings((current) => current.filter((booking) => booking.listingId !== id));
    } catch (err) {
      setError('Could not delete listing.');
    }
  }, []);

  const createBooking = useCallback(async (input: BookingRequest) => {
    setError(null);
    setBusy((state) => ({ ...state, createBooking: true }));
    try {
      const booking = await bookingService.createBooking(input);
      setBookings((current) => [booking, ...current]);
    } catch (err) {
      setError('Could not create booking.');
    } finally {
      setBusy((state) => ({ ...state, createBooking: false }));
    }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    setError(null);
    setBusy((state) => ({ ...state, cancelBookingId: id }));
    try {
      const booking = await bookingService.cancelBooking(id);
      setBookings((current) =>
        current.map((existing) => (existing.id === id ? booking : existing)),
      );
    } catch (err) {
      setError('Could not cancel booking.');
    } finally {
      setBusy((state) => ({ ...state, cancelBookingId: '' }));
    }
  }, []);

  return {
    listings,
    bookings,
    loading,
    error,
    busy,
    addListing,
    deleteListing,
    createBooking,
    cancelBooking,
  };
};

