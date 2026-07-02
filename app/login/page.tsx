'use client';

import { useActionState } from "react";
import { login, type LoginState } from '@/server/auth';

export default function Login() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

    return (
        <main className="login-page flex flex-1 items-center justify-center px-4">
            <form action={formAction} className="login-card w-full max-w-md rounded-xl p-6 space-y-5">
                <header className="space-y-1.5">
                    <h1 className="text-sm text-font">Sign In</h1>
                    <p className="text-xs text-font-muted">Enter your name and team password</p>
                </header>

                <div className="grid grid-cols-2 gap-2">
                    <div className="login-form-field">
                        <label htmlFor="firstName" className="block text-xs text-font">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            placeholder="First Name"
                            autoComplete="given-name"
                            className="login-form-input"
                        />
                    </div>

                    <div className="login-form-field">
                        <label htmlFor="lastName" className="block text-xs text-font">Last Name</label>
                        <input 
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            placeholder="Last Name"
                            autoComplete="family-name"
                            className="login-form-input"
                        />
                    </div>
                </div>

                <div className="login-form-field">
                    <label htmlFor="password" className="block text-xs text-font">Password</label>
                    <input 
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        className="login-form-input"
                    />
                </div>

                {state?.error && (
                    <p role="alert" className="text-xs text-accent">{state.error}</p>
                )}

                <button type="submit" disabled={pending} className="w-full rounded-full bg-accent py-2.5 text-sm text-fg text-font hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                    {pending ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </main>
    );
}