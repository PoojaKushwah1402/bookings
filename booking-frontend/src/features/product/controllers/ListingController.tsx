import { ListingForm } from '../components/ListingForm';
import { ListingList } from '../components/ListingList';
import { useBookingWorkspace } from '../../../app/providers/BookingWorkspaceProvider';

export const ListingController = () => {
  const { listings, loading, addListing, deleteListing } = useBookingWorkspace();

  return (
    <div className="stack">
      <div>
        <h2 className="section-title">Manage listings</h2>
        <p className="muted">
          Capture the basics (city, state, availability, amenities, keywords) and keep everything tidy.
        </p>
      </div>

      <ListingForm onSubmit={addListing} />

      {loading ? <div className="empty-state">Loading your listings…</div> : <ListingList listings={listings} onDelete={deleteListing} />}
    </div>
  );
};

