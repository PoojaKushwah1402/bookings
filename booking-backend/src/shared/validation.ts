type FieldCheck = { field: string; valid: boolean; message: string };

export const requiredString = (field: string, value: unknown, min = 1): FieldCheck => ({
    field,
    valid: typeof value === "string" && value.trim().length >= min,
    message: `${field} is required`,
});

export const optionalString = (field: string, value: unknown): FieldCheck => ({
    field,
    valid: typeof value === "undefined" || typeof value === "string",
    message: `${field} must be a string`,
});

export const arrayOfStrings = (field: string, value: unknown): FieldCheck => ({
    field,
    valid: Array.isArray(value) && value.every((item) => typeof item === "string"),
    message: `${field} must be an array of strings`,
});

export const requireAll = (...checks: FieldCheck[]): string[] =>
    checks.filter((c) => !c.valid).map((c) => c.message);

export const isEmail = (field: string, value: unknown): FieldCheck => {
    const valid =
        typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());
    return {
        field,
        valid,
        message: `${field} must be a valid email`,
    };
};


