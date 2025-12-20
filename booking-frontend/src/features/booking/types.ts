export type Listing = {
  id: string;
  userId?: string;
  title: string;
  city: string;
  state: string;
  keywords: string[];
  amenities: string[];
  note?: string;
};

export type Booking = {
  id: string;
  listingId: string;
  userId?: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'cancelled';
  note?: string;
};

export type NewListingInput = Omit<Listing, 'id'>;

export type BookingRequest = Omit<Booking, 'id' | 'status'>;


