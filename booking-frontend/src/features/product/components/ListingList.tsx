import type { Listing } from '../types';
import { ListingCard } from './ListingCard';

type ListingListProps = {
  listings: Listing[];
  onDelete: (id: string) => void;
};

export const ListingList = ({ listings, onDelete }: ListingListProps) => {
  if (!listings.length) {
    return <div className="empty-state">No listings yet. Add your first stay above.</div>;
  }

  return (
    <div className="stack">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onDelete={onDelete} />
      ))}
    </div>
  );
};

