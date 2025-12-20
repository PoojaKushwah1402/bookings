import {FormEvent} from "react";
import {useState} from "react";
import type {Credentials, User} from "../types";

type AuthPanelProps = {
    user: User | null;
    loading?: boolean;
    onSignIn: (credentials: Credentials) => Promise<void>;
    onSignUp: (credentials: Credentials) => Promise<void>;
    onSignOut: () => Promise<void>;
};

const emptyCreds: Credentials = {
    name: "",
    email: "",
    password: ""
};

export const AuthPanel = ({
    user,
    loading,
    onSignIn,
    onSignUp,
    onSignOut
}: AuthPanelProps) => {
    const [form, setForm] = useState<Credentials>(emptyCreds);
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup">("signup");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        if (mode === "signup") {
            await onSignUp(form);
        } else {
            await onSignIn(form);
        }
        setSubmitting(false);
        setForm(emptyCreds);
    };

    if (loading) {
        return (
            <section className="panel">
                <h3 className="section-title">Sign in</h3>
                <p className="muted">Loading session…</p>
            </section>
        );
    }

    if (user) {
        return (
            <section className="panel">
                <h3 className="section-title">Signed in</h3>
                <p className="muted">
                    {user.name} · {user.email}
                </p>
                <div className="button-row" style={{marginTop: 10}}>
                    <button className="btn btn-ghost" onClick={onSignOut}>
                        Sign out
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="panel">
            <h3 className="section-title">Sign in</h3>
            <p className="muted">
                Sign up or sign in to manage listings and bookings.
            </p>
            <div className="button-row" style={{marginBottom: 8}}>
                <button
                    type="button"
                    className={`btn ${
                        mode === "signup" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setMode("signup")}
                    disabled={submitting}
                >
                    Sign up
                </button>
                <button
                    type="button"
                    className={`btn ${
                        mode === "signin" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setMode("signin")}
                    disabled={submitting}
                >
                    Sign in
                </button>
            </div>
            <form className="stack" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({...prev, name: e.target.value}))
                        }
                        placeholder="Alex Host"
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                email: e.target.value
                            }))
                        }
                        placeholder="host@example.com"
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                password: e.target.value
                            }))
                        }
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="button-row">
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>
                    <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => setForm(emptyCreds)}
                        disabled={submitting}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </section>
    );
};
