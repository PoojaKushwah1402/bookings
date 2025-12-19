import { FormEvent, useMemo, useState } from 'react';
import type { Listing } from '../../booking/types';
import type { StayBookingPayload } from '../types';

type CheckoutFormProps = {
  listings: Listing[];
  onBook: (payload: StayBookingPayload) => Promise<void>;
};

const initialState: StayBookingPayload = {
  listingId: '',
  fromDate: '',
  toDate: '',
  guestNote: '',
};

const CheckoutForm = ({ listings, onBook }: CheckoutFormProps) => {
  const [form, setForm] = useState<StayBookingPayload>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabled = useMemo(
    () => !form.listingId || !form.fromDate || !form.toDate || isSubmitting,
    [form.listingId, form.fromDate, form.toDate, isSubmitting]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsSubmitting(true);
    await onBook(form);
    setIsSubmitting(false);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="stack" aria-label="Book stay">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="listingId">Listing</label>
          <select
            id="listingId"
            name="listingId"
            value={form.listingId}
            onChange={(e) => setForm((prev) => ({ ...prev, listingId: e.target.value }))}
          >
            <option value="">Select a listing</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title} – {listing.city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fromDate">From</label>
          <input
            id="fromDate"
            type="date"
            value={form.fromDate}
            onChange={(e) => setForm((prev) => ({ ...prev, fromDate: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="toDate">To</label>
          <input
            id="toDate"
            type="date"
            value={form.toDate}
            onChange={(e) => setForm((prev) => ({ ...prev, toDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="guestNote">Notes (optional)</label>
        <textarea
          id="guestNote"
          placeholder="Special instructions"
          value={form.guestNote}
          onChange={(e) => setForm((prev) => ({ ...prev, guestNote: e.target.value }))}
        />
      </div>

      <div className="button-row">
        <button className="btn btn-primary" type="submit" disabled={disabled}>
          {isSubmitting ? 'Booking…' : 'Book stay'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
