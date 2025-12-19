import { FormEvent, useMemo, useState } from 'react';
import type { ListingPayload } from '../types';

type ListingFormProps = {
  onSubmit: (payload: ListingPayload) => Promise<void>;
};

const initialPayload: ListingPayload = {
  title: '',
  city: '',
  state: '',
  availability: '',
  amenities: [],
  keywords: [],
};

export const ListingForm = ({ onSubmit }: ListingFormProps) => {
  const [form, setForm] = useState<ListingPayload>(initialPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabled = useMemo(
    () => !form.title || !form.city || !form.state || !form.availability,
    [form]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsSubmitting(true);
    await onSubmit({
      ...form,
      amenities: form.amenities.filter(Boolean),
      keywords: form.keywords.filter(Boolean),
    });
    setIsSubmitting(false);
    setForm(initialPayload);
  };

  const splitToList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="stack" aria-label="Create listing">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            placeholder="Cozy loft near downtown"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            placeholder="Austin"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            placeholder="Texas"
            value={form.state}
            onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="availability">Availability notes</label>
          <input
            id="availability"
            name="availability"
            placeholder="Flexible in February"
            value={form.availability}
            onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="amenities">Amenities (comma separated)</label>
          <input
            id="amenities"
            name="amenities"
            placeholder="WiFi, Parking, Workspace"
            value={form.amenities.join(', ')}
            onChange={(e) => setForm((prev) => ({ ...prev, amenities: splitToList(e.target.value) }))}
          />
        </div>
        <div className="field">
          <label htmlFor="keywords">Keywords (comma separated)</label>
          <input
            id="keywords"
            name="keywords"
            placeholder="lakeview, pet-friendly"
            value={form.keywords.join(', ')}
            onChange={(e) => setForm((prev) => ({ ...prev, keywords: splitToList(e.target.value) }))}
          />
        </div>
      </div>

      <div className="button-row">
        <button className="btn btn-primary" type="submit" disabled={disabled || isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save listing'}
        </button>
      </div>
    </form>
  );
};

