export type CheckoutRequest = {
  listingId: string;
  startDate: string;
  endDate: string;
};
export type StayBookingStatus = 'booked' | 'cancelled';

export type StayBooking = {
  id: string;
  listingId: string;
  fromDate: string;
  toDate: string;
  guestNote?: string;
  status: StayBookingStatus;
  createdAt: string;
};

export type StayBookingPayload = {
  listingId: string;
  fromDate: string;
  toDate: string;
  guestNote?: string;
};

