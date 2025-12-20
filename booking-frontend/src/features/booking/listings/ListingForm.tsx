import {FormEvent, useState} from "react";
import type {NewListingInput} from "../types";

type ListingFormProps = {
    onSubmit: (payload: NewListingInput) => Promise<void>;
    isSaving?: boolean;
    disabled?: boolean;
    userId?: string;
};

const blankForm: NewListingInput = {
    userId: "",
    title: "",
    city: "",
    state: "",
    keywords: [],
    amenities: [],
    note: ""
};

export const ListingForm = ({
    onSubmit,
    isSaving,
    disabled,
    userId
}: ListingFormProps) => {
    const [form, setForm] = useState<NewListingInput>({
        ...blankForm,
        userId: userId ?? ""
    });
    const [keywordsText, setKeywordsText] = useState("");
    const [amenitiesText, setAmenitiesText] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const keywords = keywordsText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        const amenities = amenitiesText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        const payload: NewListingInput = {
            ...form,
            keywords,
            amenities
        };
        await onSubmit(payload);
        setForm({...blankForm, userId: userId ?? ""});
        setKeywordsText("");
        setAmenitiesText("");
    };

    const updateField = (
        field: keyof NewListingInput,
        value: string | string[]
    ) => {
        setForm((current) => ({...current, [field]: value}));
    };

    const handleListField = (field: "keywords" | "amenities", raw: string) => {
        const items = raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        updateField(field, items);
    };

    return (
        <form className="stack" onSubmit={handleSubmit}>
            <input type="hidden" value={form.userId} />
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="title">Listing name</label>
                    <input
                        id="title"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
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
                        onChange={(e) => updateField("city", e.target.value)}
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
                        onChange={(e) => updateField("state", e.target.value)}
                        placeholder="TX"
                        required
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="form-grid">
                <div className="field">
                    <label htmlFor="keywords">Keywords (comma separated)</label>
                    <input
                        id="keywords"
                        value={keywordsText}
                        onChange={(e) => setKeywordsText(e.target.value)}
                        placeholder="wifi, parking, balcony"
                        disabled={disabled}
                    />
                </div>

                <div className="field">
                    <label htmlFor="amenities">
                        Amenities (comma separated)
                    </label>
                    <input
                        id="amenities"
                        value={amenitiesText}
                        onChange={(e) => setAmenitiesText(e.target.value)}
                        placeholder="Washer, Desk, Air purifier"
                        disabled={disabled}
                    />
                </div>

                <div className="field">
                    <label htmlFor="note">Note</label>
                    <textarea
                        id="note"
                        value={form.note ?? ""}
                        onChange={(e) => updateField("note", e.target.value)}
                        placeholder="Availability, restrictions, or any host notes"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="button-row">
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isSaving || disabled}
                >
                    {isSaving ? "Saving..." : "Save listing"}
                </button>
                <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() =>
                        setForm({...blankForm, userId: userId ?? ""})
                    }
                    disabled={isSaving || disabled}
                >
                    Reset
                </button>
            </div>
        </form>
    );
};
