import { useMemo } from 'react';
import type { Booking, Listing } from '../types';

type BookingListProps = {
  bookings: Booking[];
  listings: Listing[];
  cancellingId?: string;
  onCancel: (id: string) => Promise<void>;
  canManage?: boolean;
};

export const BookingList = ({
  bookings,
  listings,
  cancellingId,
  onCancel,
  canManage = true,
}: BookingListProps) => {
  const listingLookup = useMemo(
    () => new Map(listings.map((listing) => [listing.id, listing])),
    [listings],
  );

  if (!bookings.length) {
    return <div className="empty-state">No bookings yet.</div>;
  }

  return (
    <div className="stack">
      {bookings.map((booking) => {
        const listing = listingLookup.get(booking.listingId);
        const isCancelled = booking.status === 'cancelled';
        return (
          <div key={booking.id} className="card">
            <h4>{listing?.title ?? 'Listing removed'}</h4>
            <p className="muted">
              {booking.startDate} → {booking.endDate}
            </p>
            {listing ? (
              <p className="muted" style={{ marginBottom: 8 }}>
                {listing.city}, {listing.state}
              </p>
            ) : null}
            <div
              className={`status-badge ${isCancelled ? 'cancelled' : ''}`}
              aria-label={`Booking is ${booking.status}`}
            >
              <span className="badge-dot" /> {booking.status}
            </div>
            {booking.note ? (
              <p className="muted" style={{ marginTop: 8 }}>
                {booking.note}
              </p>
            ) : null}
            {!isCancelled ? (
              <div className="button-row" style={{ marginTop: 12 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => onCancel(booking.id)}
                  disabled={cancellingId === booking.id || !canManage}
                >
                  {cancellingId === booking.id ? 'Cancelling...' : 'Cancel booking'}
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};


