export type Listing = {
  id: string;
  title: string;
  city: string;
  state: string;
  availability: string;
  amenities: string[];
  keywords: string[];
  isActive: boolean;
  createdAt: string;
};

export type ListingPayload = {
  title: string;
  city: string;
  state: string;
  availability: string;
  amenities: string[];
  keywords: string[];
};

