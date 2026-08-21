"use client";

import { useActionState, useState } from "react";
import { createUser, deactivateUser, reactivateUser, type CreateUserState, type ReactivateUserState } from "@/server/users";

export function CreateUserForm() {
    const [role, setRole] = useState<"STANDARD" | "MANAGER">("STANDARD");
    const [state, formAction, pending] = useActionState<CreateUserState, FormData>(createUser, undefined);

    return (
        <form action={formAction} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-fg">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full rounded-md border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-border-focus"
                        placeholder="First Name"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-fg">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full rounded-md border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-border-focus"
                        placeholder="Last Name"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-fg">Account Level</label>
                <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(event) => setRole(event.currentTarget.value === "MANAGER" ? "MANAGER" : "STANDARD")}
                    className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus"
                >
                    <option value="STANDARD">Standard</option>
                    <option value="MANAGER">Manager</option>
                </select>
            </div>

            {role === "MANAGER" ? (
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-fg">Custom Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        className="w-full rounded-md border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-border-focus"
                        placeholder="Enter a unique password"
                    />

                    <p className="text-xs text-fg-muted">Manager accounts must have their own password.</p>
                </div>
            ) : (
                <p className="text-xs text-fg-muted">Standard accounts automatically use the shared team password.</p>
            )}

            {state?.error ? <p className="text-sm text-accent">{state.error}</p> : null}
            {state?.success ? <p className="text-sm text-fg-muted">{state.success}</p> : null}

            <button type="submit" disabled={pending} className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
                {pending ? "Creating..." : "Create User"}
            </button>
        </form>
    );
}

type DeleteUserButtonProps = { userId: number; userName: string; };

export function DeactivateUserButton({ userId, userName }: DeleteUserButtonProps) {
    const deleteAction = deactivateUser.bind(null, userId);

    return (
        <form
            action={deleteAction}
            onSubmit={(event) => {
                if (!window.confirm(`Delete the account for ${userName}?`)) {
                    event.preventDefault();
                }
            }}
        >
            <button type="submit" className="rounded-md border border-accent/50 px-3 py-1.5 text-sm text-accent transition-colors hover:border-accent hover:bg-accent/10">Deactivate</button>
        </form>
    );
}

type ReactivateUserControlProps = { userId: number; userName: string; userRole: "STANDARD" | "MANAGER" | "ADMINISTRATOR" };

export function ReactivateUserControl({userId, userRole}: ReactivateUserControlProps) {
    const reactivateAction = reactivateUser.bind(null, userId);
    const [state, formAction, pending] = useActionState<ReactivateUserState, FormData>(reactivateAction, undefined);

    if (userRole === "ADMINISTRATOR") {
        return null;
    }

    return (
        <form action={formAction} className="flex flex-col items-end gap-2">
            {userRole === "MANAGER" && (
                <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="New manager password"
                    className="w-56 rounded-md border bg-input px-3 py-2 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-border-focus"
                />
            )}

            <button
                type="submit"
                disabled={pending}
                className="rounded-md border border-green-600/50 px-3 py-1.5 text-sm text-green-600 transition-colors hover:border-green-500 hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Reactivating..." : "Reactivate"}
            </button>

            {state?.error && (
                <p className="max-w-64 text-right text-xs text-accent">{state.error}</p>
            )}

            {state?.success && (
                <p className="max-w-64 text-right text-xs text-fg-muted">{state.success}</p>
            )}
        </form>
    );
}
