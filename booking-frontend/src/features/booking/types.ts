export type AvailabilityWindow = {
  startDate: string;
  endDate: string;
  note?: string;
};

export type Listing = {
  id: string;
  title: string;
  city: string;
  state: string;
  keywords: string[];
  amenities: string[];
  availability: AvailabilityWindow;
};

export type Booking = {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'cancelled';
  note?: string;
};

export type NewListingInput = Omit<Listing, 'id'>;

export type BookingRequest = Omit<Booking, 'id' | 'status'>;


