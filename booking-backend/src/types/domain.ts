export type Listing = {
    id: string;
    userId: string;
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
    userId: string;
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
    refreshToken?: string;
};


