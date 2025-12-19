import { FormEvent, useState } from 'react';
import type { AvailabilityWindow, NewListingInput } from '../types';

type ListingFormProps = {
  onSubmit: (payload: NewListingInput) => Promise<void>;
  isSaving?: boolean;
  disabled?: boolean;
};

const emptyAvailability: AvailabilityWindow = {
  startDate: '',
  endDate: '',
  note: '',
};

const blankForm: NewListingInput = {
  title: '',
  city: '',
  state: '',
  keywords: [],
  amenities: [],
  availability: emptyAvailability,
};

export const ListingForm = ({ onSubmit, isSaving, disabled }: ListingFormProps) => {
  const [form, setForm] = useState<NewListingInput>(blankForm);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: NewListingInput = {
      ...form,
      keywords: form.keywords.map((keyword) => keyword.trim()).filter(Boolean),
      amenities: form.amenities.map((amenity) => amenity.trim()).filter(Boolean),
    };
    await onSubmit(payload);
    setForm(blankForm);
  };

  const updateField = (field: keyof NewListingInput, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAvailability = (field: keyof AvailabilityWindow, value: string) => {
    setForm((current) => ({
      ...current,
      availability: { ...current.availability, [field]: value },
    }));
  };

  const handleListField = (field: 'keywords' | 'amenities', raw: string) => {
    const items = raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    updateField(field, items);
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="stack">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">Listing name</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Quiet loft near downtown"
              required
              disabled={disabled}
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Austin"
              required
              disabled={disabled}
            />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              value={form.state}
              onChange={(e) => updateField('state', e.target.value)}
              placeholder="TX"
              required
              disabled={disabled}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="available-from">Available from</label>
            <input
              id="available-from"
              type="date"
              value={form.availability.startDate}
              onChange={(e) => updateAvailability('startDate', e.target.value)}
              required
              disabled={disabled}
            />
          </div>
          <div className="field">
            <label htmlFor="available-to">Available to</label>
            <input
              id="available-to"
              type="date"
              value={form.availability.endDate}
              onChange={(e) => updateAvailability('endDate', e.target.value)}
              required
              disabled={disabled}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="availability-note">Availability note</label>
          <textarea
            id="availability-note"
            value={form.availability.note ?? ''}
            onChange={(e) => updateAvailability('note', e.target.value)}
            placeholder="Weeknight-only stays, no pets, etc."
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label htmlFor="keywords">Keywords (comma separated)</label>
          <input
            id="keywords"
            value={form.keywords.join(', ')}
            onChange={(e) => handleListField('keywords', e.target.value)}
            placeholder="wifi, parking, balcony"
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label htmlFor="amenities">Amenities (comma separated)</label>
          <input
            id="amenities"
            value={form.amenities.join(', ')}
            onChange={(e) => handleListField('amenities', e.target.value)}
            placeholder="Washer, Desk, Air purifier"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="button-row">
        <button className="btn btn-primary" type="submit" disabled={isSaving || disabled}>
          {isSaving ? 'Saving...' : 'Save listing'}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => setForm(blankForm)}
          disabled={isSaving || disabled}
        >
          Reset
        </button>
      </div>
    </form>
  );
};


