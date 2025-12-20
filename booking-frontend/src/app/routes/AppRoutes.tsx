import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {AuthPanel, useAuth} from "../../features/auth";
import {BookingForm, BookingList, ListingForm, ListingList, SectionCard, useBookings, useListings} from "../../features/booking";

const Nav = ({signedIn}: {signedIn: boolean}) => (
    <nav className="panel" style={{marginBottom: 16}}>
        <div className="button-row" style={{justifyContent: "space-between", alignItems: "center"}}>
            <div className="button-row" style={{gap: 12}}>
                <Link className="btn btn-ghost" to="/signin">
                    Auth
                </Link>
                <Link className="btn btn-ghost" to="/listings">
                    Listings
                </Link>
                <Link className="btn btn-ghost" to="/bookings">
                    Bookings
                </Link>
            </div>
            <span className="muted">{signedIn ? "Signed in" : "Guest"}</span>
        </div>
    </nav>
);

const ListingsPage = ({
    locked,
    listingLoading,
    listings,
    busyAdd,
    addListing,
    deleteListing,
    userId
}: {
    locked: boolean;
    listingLoading: boolean;
    listings: any[];
    busyAdd: boolean;
    addListing: (input: any) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    userId?: string;
}) => (
    <div className="app-grid">
        <SectionCard
            title="Create listing"
            description="Add a new stay with city, state, keywords, amenities, and a note."
        >
            <ListingForm
                onSubmit={(payload) => addListing({...payload, userId})}
                isSaving={busyAdd}
                disabled={locked}
                userId={userId}
            />
            {locked ? (
                <p className="muted" style={{marginTop: 8}}>
                    Sign in to add listings.
                </p>
            ) : null}
        </SectionCard>

        <SectionCard
            title="Listings"
            description="Manage what is available. Removing a listing also clears its bookings."
            loading={listingLoading}
        >
            <ListingList listings={listings} onDelete={deleteListing} canManage={!locked} />
        </SectionCard>
    </div>
);

const BookingsPage = ({
    locked,
    bookingLoading,
    listings,
    bookings,
    busyCreate,
    cancelId,
    createBooking,
    cancelBooking,
    userId
}: {
    locked: boolean;
    bookingLoading: boolean;
    listings: any[];
    bookings: any[];
    busyCreate: boolean;
    cancelId: string;
    createBooking: (input: any) => Promise<void>;
    cancelBooking: (id: string) => Promise<void>;
    userId?: string;
}) => (
    <div className="app-grid">
        <SectionCard
            title="Book a stay"
            description="Select a listing, block dates for a stay, or cancel later."
        >
            <BookingForm
                listings={listings}
                onSubmit={(payload) => createBooking({...payload, userId})}
                isSaving={busyCreate}
                disabled={locked || listings.length === 0}
                userId={userId}
            />
            {listings.length === 0 ? (
                <p className="muted" style={{marginTop: 8}}>
                    Add a listing first to create a booking.
                </p>
            ) : null}
        </SectionCard>

        <SectionCard
            title="Bookings"
            description="Host-side reservations you can confirm or cancel."
            loading={bookingLoading}
        >
            <BookingList
                bookings={bookings}
                listings={listings}
                onCancel={cancelBooking}
                cancellingId={cancelId}
                canManage={!locked}
            />
        </SectionCard>
    </div>
);

const AuthPage = ({
    user,
    loading,
    signIn,
    signUp,
    signOut
}: {
    user: any;
    loading: boolean;
    signIn: (c: any) => Promise<void>;
    signUp: (c: any) => Promise<void>;
    signOut: () => Promise<void>;
}) => (
    <div className="app-grid">
        <AuthPanel user={user} loading={loading} onSignIn={signIn} onSignOut={signOut} onSignUp={signUp} />
    </div>
);

export const AppRoutes = () => {
    const {user, token, loading: authLoading, signIn, signOut, signUp} = useAuth();
    const {
        listings,
        loading: listingLoading,
        error: listingError,
        busyAdd,
        addListing,
        deleteListing
    } = useListings(token ?? undefined);
    const {
        bookings,
        loading: bookingLoading,
        error: bookingError,
        busyCreate,
        cancelId,
        createBooking,
        cancelBooking
    } = useBookings(token ?? undefined);
    const locked = !user;

    return (
        <BrowserRouter>
            <div className="app-shell">
                <header className="app-header">
                    <p className="eyebrow">Booking workspace</p>
                    <h1>Host console</h1>
                    <p className="lede">
                        Manage listings and bookings with a simple host view. Sign in to enable actions; data flows to the backend API.
                    </p>
                    {listingError || bookingError ? (
                        <div className="card" style={{borderColor: "rgba(255,110,110,0.5)"}}>
                            {listingError || bookingError}
                        </div>
                    ) : null}
                </header>

                <Nav signedIn={!!user} />

                <Routes>
                    <Route
                        path="/signin"
                        element={<AuthPage user={user} loading={authLoading} signIn={signIn} signUp={signUp} signOut={signOut} />}
                    />
                    <Route
                        path="/listings"
                        element={
                            locked ? (
                                <Navigate to="/signin" replace />
                            ) : (
                                <ListingsPage
                                    locked={locked}
                                    listingLoading={listingLoading}
                                    listings={listings}
                                    busyAdd={busyAdd}
                                    addListing={addListing}
                                    deleteListing={deleteListing}
                                    userId={user?.id}
                                />
                            )
                        }
                    />
                    <Route
                        path="/bookings"
                        element={
                            locked ? (
                                <Navigate to="/signin" replace />
                            ) : (
                                <BookingsPage
                                    locked={locked}
                                    bookingLoading={bookingLoading}
                                    listings={listings}
                                    bookings={bookings}
                                    busyCreate={busyCreate}
                                    cancelId={cancelId}
                                    createBooking={createBooking}
                                    cancelBooking={cancelBooking}
                                    userId={user?.id}
                                />
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to="/signin" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

