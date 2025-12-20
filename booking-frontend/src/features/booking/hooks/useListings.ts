import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Listing, NewListingInput } from '../types';

type ListingsController = {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  busyAdd: boolean;
  addListing: (input: NewListingInput) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
};

const initialState: ListingsController = {
  listings: [],
  loading: true,
  error: null,
  busyAdd: false,
  addListing: async () => {},
  deleteListing: async () => {},
};

export const useListings = (token?: string): ListingsController => {
  const [state, setState] = useState<Omit<ListingsController, 'addListing' | 'deleteListing'>>({
    listings: initialState.listings,
    loading: initialState.loading,
    error: initialState.error,
    busyAdd: initialState.busyAdd,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await bookingService.getListings(token);
      setState((s) => ({ ...s, listings: data, loading: false }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Unable to load listings.', loading: false }));
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const addListing = useCallback(async (input: NewListingInput) => {
    setState((s) => ({ ...s, busyAdd: true, error: null }));
    try {
      const created = await bookingService.createListing(input, token);
      setState((s) => ({ ...s, listings: [created, ...s.listings] }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Could not save listing.' }));
    } finally {
      setState((s) => ({ ...s, busyAdd: false }));
    }
  }, [token]);

  const deleteListing = useCallback(async (id: string) => {
    setState((s) => ({ ...s, error: null }));
    try {
      await bookingService.deleteListing(id, token);
      setState((s) => ({
        ...s,
        listings: s.listings.filter((listing) => listing.id !== id),
      }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Could not delete listing.' }));
    }
  }, [token]);

  return {
    ...state,
    addListing,
    deleteListing,
  };
};

export default useListings;


