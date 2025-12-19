import type { Listing } from '../types';

type ListingCardProps = {
  listing: Listing;
  onDelete: (id: string) => void;
};

export const ListingCard = ({ listing, onDelete }: ListingCardProps) => {
  return (
    <div className="card">
      <h4>{listing.title}</h4>
      <p className="muted">
        {listing.city}, {listing.state}
      </p>
      <p className="muted">{listing.availability}</p>
      <div className="pill-row">
        {listing.amenities.map((item) => (
          <span key={item} className="pill">
            {item}
          </span>
        ))}
      </div>
      <div className="pill-row">
        {listing.keywords.map((item) => (
          <span key={item} className="pill">
            #{item}
          </span>
        ))}
      </div>
      <div className="button-row" style={{ marginTop: 10 }}>
        <button className="btn btn-ghost" type="button" onClick={() => onDelete(listing.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

