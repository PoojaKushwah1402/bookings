import {
  BookingForm,
  BookingList,
  ListingForm,
  ListingList,
  SectionCard,
} from '../features/booking';
import { useBookingController } from '../features/booking/hooks/useBookingController';
import { AuthPanel, useAuth } from '../features/auth';

const AppShell = () => {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const {
    listings,
    bookings,
    loading,
    error,
    busy,
    addListing,
    deleteListing,
    createBooking,
    cancelBooking,
  } = useBookingController();
  const locked = !user;

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Booking workspace</p>
        <h1>Host console</h1>
        <p className="lede">
          Maintain listings with city, state, availability windows, amenities, and host-side
          bookings. All UI runs locally; wire the service layer to your backend when ready.
        </p>
        {error ? (
          <div className="card" style={{ borderColor: 'rgba(255,110,110,0.5)' }}>
            {error}
          </div>
        ) : null}
      </header>

      <div className="app-grid">
        <AuthPanel user={user} loading={authLoading} onSignIn={signIn} onSignOut={signOut} />

        <SectionCard
          title="Create listing"
          description="Add a new stay with city, state, keywords, amenities, and availability."
        >
          <ListingForm onSubmit={addListing} isSaving={busy.addListing} disabled={locked} />
          {locked ? (
            <p className="muted" style={{ marginTop: 8 }}>
              Sign in to add listings.
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Book a stay"
          description="Select a listing, block dates for a stay, or cancel later."
        >
          <BookingForm
            listings={listings}
            onSubmit={createBooking}
            isSaving={busy.createBooking}
            disabled={locked || listings.length === 0}
          />
          {listings.length === 0 ? (
            <p className="muted" style={{ marginTop: 8 }}>
              Add a listing first to create a booking.
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Listings"
          description="Manage what is available. Removing a listing also clears its bookings."
          loading={loading}
        >
          <ListingList listings={listings} onDelete={deleteListing} canManage={!locked} />
        </SectionCard>

        <SectionCard
          title="Bookings"
          description="Host-side reservations you can confirm or cancel."
          loading={loading}
        >
          <BookingList
            bookings={bookings}
            listings={listings}
            onCancel={cancelBooking}
            cancellingId={busy.cancelBookingId}
            canManage={!locked}
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default AppShell;

