import { useCallback, useEffect, useState } from 'react';
import { listingService } from '../services/listingService';
import type { Listing, ListingPayload } from '../types';

type UseListingsState = {
  listings: Listing[];
  loading: boolean;
  addListing: (payload: ListingPayload) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  refreshListings: () => Promise<void>;
};

export const useListings = (): UseListingsState => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshListings = useCallback(async () => {
    setLoading(true);
    const data = await listingService.list();
    setListings(data);
    setLoading(false);
  }, []);

  const addListing = useCallback(
    async (payload: ListingPayload) => {
      const created = await listingService.create(payload);
      setListings((prev) => [...prev, created]);
    },
    []
  );

  const deleteListing = useCallback(async (id: string) => {
    await listingService.remove(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    void refreshListings();
  }, [refreshListings]);

  return { listings, loading, addListing, deleteListing, refreshListings };
};

