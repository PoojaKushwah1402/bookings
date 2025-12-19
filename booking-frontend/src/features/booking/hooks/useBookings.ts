import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking, BookingRequest } from '../types';

type BookingsController = {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  busyCreate: boolean;
  cancelId: string;
  createBooking: (input: BookingRequest) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
};

const initialState: Omit<BookingsController, 'createBooking' | 'cancelBooking'> = {
  bookings: [],
  loading: true,
  error: null,
  busyCreate: false,
  cancelId: '',
};

export const useBookings = (): BookingsController => {
  const [state, setState] = useState(initialState);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await bookingService.getBookings();
      setState((s) => ({ ...s, bookings: data, loading: false }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Unable to load bookings.', loading: false }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createBooking = useCallback(async (input: BookingRequest) => {
    setState((s) => ({ ...s, busyCreate: true, error: null }));
    try {
      const booking = await bookingService.createBooking(input);
      setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Could not create booking.' }));
    } finally {
      setState((s) => ({ ...s, busyCreate: false }));
    }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    setState((s) => ({ ...s, cancelId: id, error: null }));
    try {
      const booking = await bookingService.cancelBooking(id);
      setState((s) => ({
        ...s,
        bookings: s.bookings.map((existing) => (existing.id === id ? booking : existing)),
      }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Could not cancel booking.' }));
    } finally {
      setState((s) => ({ ...s, cancelId: '' }));
    }
  }, []);

  return {
    ...state,
    createBooking,
    cancelBooking,
  };
};

export default useBookings;


