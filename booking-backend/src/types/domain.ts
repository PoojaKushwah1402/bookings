export type Listing = {
    id: string;
    title: string;
    city: string;
    state: string;
    keywords: string[];
    amenities: string[];
    note?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
    id: string;
    listingId: string;
    startDate: string;
    endDate: string;
    status: BookingStatus;
    note?: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export type AuthSession = {
    token: string;
    user: User;
};


