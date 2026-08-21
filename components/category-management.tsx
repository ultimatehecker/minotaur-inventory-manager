"use client";

import { useActionState, useState } from "react";
import { createCategory, deleteCategory, type CategoryActionState } from "@/server/categories";

type ParentCategory = { id: number; name: string; };
type CreateCategoryFormProps = { parentCategories: ParentCategory[]; };

export function CreateCategoryForm({parentCategories}: CreateCategoryFormProps) {
    const [level, setLevel] = useState<"CATEGORY" | "SUBCATEGORY">("CATEGORY");

    const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(createCategory, undefined);

    return (
        <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-fg">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={level === "CATEGORY" ? "Motors" : "Brushless Motors"}
                    className="w-full rounded-md border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-border-focus"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="level" className="block text-sm font-medium text-fg">Type</label>

                <select
                    id="level"
                    name="level"
                    value={level}
                    onChange={(event) => setLevel(event.currentTarget.value as | "CATEGORY" | "SUBCATEGORY")}
                    className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus"
                >
                    <option value="CATEGORY">Category</option>
                    <option value="SUBCATEGORY">Subcategory</option>
                </select>
            </div>

            {level === "SUBCATEGORY" && (
                <div className="space-y-2">
                    <label htmlFor="parentId" className="block text-sm font-medium text-fg">Parent Category</label>

                    <select
                        id="parentId"
                        name="parentId"
                        required
                        defaultValue=""
                        className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus"
                    >
                        <option value="" disabled>Select a category</option>

                        {parentCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <p className="text-xs text-fg-muted">Inventory items can later be assigned to subcategories.</p>
                </div>
            )}

            {state?.error && (
                <p role="alert" className="text-sm text-accent">{state.error}</p>
            )}

            {state?.success && (
                <p className="text-sm text-fg-muted">{state.success}</p>
            )}

            <button type="submit" disabled={pending} className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
                {pending ? "Creating..." : "Create Category"}
            </button>
        </form>
    );
}

type DeleteCategoryButtonProps = { categoryId: number; categoryName: string; disabled?: boolean; };

export function DeleteCategoryButton({categoryId, categoryName, disabled = false }: DeleteCategoryButtonProps) {
    const deleteAction = deleteCategory.bind(null, categoryId);

    if (disabled) {
        return (
            <span className="text-xs text-fg-dim">Not Empty</span>
        );
    }

    return (
        <form
            action={deleteAction}
            onSubmit={(event) => {
                const confirmed = window.confirm(`Delete ${categoryName}?`);

                if (!confirmed) {
                    event.preventDefault();
                }
            }}
        >
            <button type="submit" className="rounded-md border border-accent/50 px-3 py-1.5 text-sm text-accent transition-colors hover:border-accent hover:bg-accent/10">
                Delete
            </button>
        </form>
    );
}