"use client";

import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import Window from "@/components/window";

import { createItem, type CreateItemState } from "@/server/items";

type AddItemButtonProps = { categoryId: number; categoryName: string };

export function AddItemButton({ categoryId, categoryName }: AddItemButtonProps) {
    const [open, setOpen] = useState(false);
    const createItemAction = createItem.bind(null, categoryId);
    const [state, formAction, pending] = useActionState<CreateItemState, FormData>(createItemAction, undefined);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
                <Plus size={16} />
                Add Part
            </button>

            <Window open={open} onClose={() => setOpen(false)} title="Add Part" description={`Add a part to ${categoryName}.`}>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="part-name" className="block text-sm font-medium text-fg">Part Name</label>
                        <input id="part-name" name="name" required placeholder="Kraken X60" className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="part-number" className="block text-sm font-medium text-fg">Part Number</label>
                        <input id="part-number" name="partNumber" required placeholder="14-1600" className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="block text-sm font-medium text-fg">Quantity</label>
                            <input id="quantity" name="quantity" type="number" required min={0} defaultValue={1} className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="vendor" className="block text-sm font-medium text-fg">Vendor</label>
                            <select id="vendor" name="vendor" required defaultValue="" className="w-full rounded-md border bg-input px-3 py-2.5 text-sm text-fg outline-none focus:border-border-focus">
                                <option value="" disabled>Select</option>
                                <option value="WCP">WCP</option>
                                <option value="VEX">VEX</option>
                                <option value="ANDYMARK">AndyMark</option>
                                <option value="THRIFTYBOT">ThriftyBot</option>
                                <option value="REV">REV</option>
                                <option value="CTRE">CTRE</option>
                                <option value="MCMASTER">McMaster</option>
                                <option value="LIMELIGHT">Limelight</option>
                            </select>
                        </div>
                    </div>

                    {state?.error && (
                        <p className="text-sm text-accent">{state.error}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg">Cancel</button>
                        <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-60">
                            {pending ? "Adding..." : "Add Part"}
                        </button>
                    </div>
                </form>
            </Window>
        </>
    );
}