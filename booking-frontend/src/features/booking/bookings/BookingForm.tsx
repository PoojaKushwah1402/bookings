import { FormEvent, useState } from 'react';
import type { BookingRequest, Listing } from '../types';

type BookingFormProps = {
  listings: Listing[];
  onSubmit: (payload: BookingRequest) => Promise<void>;
  isSaving?: boolean;
  disabled?: boolean;
  userId?: string;
};

const blankBooking: BookingRequest = {
  listingId: '',
  userId: '',
  startDate: '',
  endDate: '',
  note: '',
};

export const BookingForm = ({ listings, onSubmit, isSaving, disabled, userId }: BookingFormProps) => {
  const [form, setForm] = useState<BookingRequest>({ ...blankBooking, userId: userId ?? '' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ ...blankBooking, userId: userId ?? '' });
  };

  const updateField = (field: keyof BookingRequest, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="listing">Listing</label>
        <select
          id="listing"
          value={form.listingId}
          onChange={(e) => updateField('listingId', e.target.value)}
          required
          disabled={disabled}
        >
          <option value="">Select a listing</option>
          {listings.map((listing) => (
            <option key={listing.id} value={listing.id}>
              {listing.title} — {listing.city}, {listing.state}
            </option>
          ))}
        </select>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="start">Start date</label>
          <input
            id="start"
            type="date"
            value={form.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
        <div className="field">
          <label htmlFor="end">End date</label>
          <input
            id="end"
            type="date"
            value={form.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">Booking notes</label>
        <textarea
          id="note"
          value={form.note ?? ''}
          onChange={(e) => updateField('note', e.target.value)}
          placeholder="Optional: host constraints, check-in window, etc."
          disabled={disabled}
        />
      </div>

      <div className="button-row">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={disabled || isSaving || !form.listingId}
        >
          {isSaving ? 'Booking...' : 'Book stay'}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => setForm({ ...blankBooking, userId: userId ?? '' })}
          disabled={disabled || isSaving}
        >
          Reset
        </button>
      </div>
    </form>
  );
};


