import type { Listing } from '../types';

type ListingListProps = {
  listings: Listing[];
  onDelete: (id: string) => Promise<void>;
  canManage?: boolean;
};

export const ListingList = ({ listings, onDelete, canManage = true }: ListingListProps) => {
  if (!listings.length) {
    return <div className="empty-state">No listings yet. Add one to get started.</div>;
  }

  return (
    <div className="stack">
      {listings.map((listing) => (
        <div key={listing.id} className="card">
          <h4>{listing.title}</h4>
          <p className="muted">
            {listing.city}, {listing.state}
          </p>
          <p className="muted" style={{ marginBottom: 8 }}>
            {listing.availability.startDate} → {listing.availability.endDate}
            {listing.availability.note ? ` · ${listing.availability.note}` : ''}
          </p>

          <div className="pill-row">
            {listing.keywords.map((keyword) => (
              <span key={keyword} className="pill">
                {keyword}
              </span>
            ))}
          </div>

          <div className="pill-row">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="pill">
                {amenity}
              </span>
            ))}
          </div>

          <div className="button-row" style={{ marginTop: 12 }}>
            <button
              className="btn btn-ghost"
              onClick={() => onDelete(listing.id)}
              disabled={!canManage}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


