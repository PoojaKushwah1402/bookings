import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useListings } from '../../features/product/hooks/useListings';
import type { Listing, ListingPayload } from '../../features/product/types';

type BookingWorkspaceValue = {
  listings: Listing[];
  loading: boolean;
  addListing: (payload: ListingPayload) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  refreshListings: () => Promise<void>;
};

const BookingWorkspaceContext = createContext<BookingWorkspaceValue | undefined>(undefined);

export const BookingWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { listings, loading, addListing, deleteListing, refreshListings } = useListings();

  const value = useMemo(
    () => ({ listings, loading, addListing, deleteListing, refreshListings }),
    [listings, loading, addListing, deleteListing, refreshListings]
  );

  return <BookingWorkspaceContext.Provider value={value}>{children}</BookingWorkspaceContext.Provider>;
};

export const useBookingWorkspace = (): BookingWorkspaceValue => {
  const ctx = useContext(BookingWorkspaceContext);
  if (!ctx) {
    throw new Error('useBookingWorkspace must be used within BookingWorkspaceProvider');
  }
  return ctx;
};

