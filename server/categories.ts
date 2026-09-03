"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authenticate } from "@/server/session";
import prisma from "@/prisma/prisma";

const CreateCategorySchema = z
    .object({
        name: z.string().trim().min(1, "Category name is required.").max(80, "Category name is too long."),
        level: z.enum(["CATEGORY", "SUBCATEGORY"]),
        parentId: z.string().optional(),
    })
    .superRefine((data, context) => {
        if (data.level === "SUBCATEGORY" && !data.parentId) {
            context.addIssue({
                code: "custom",
                path: ["parentId"],
                message: "A subcategory must have a parent category.",
            });
        }
    });

export type CategoryActionState = | { error?: string; success?: string; } | undefined;

async function requireInventoryManager() {
    const session = await authenticate();

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "MANAGER" && session.user.role !== "ADMINISTRATOR") {
        redirect("/");
    }

    return session;
}

export async function createCategory(_previousState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
    await requireInventoryManager();

    const parsed = CreateCategorySchema.safeParse({
        name: formData.get("name"),
        level: formData.get("level"),
        parentId: formData.get("parentId") || undefined,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid category information." };
    }

    const { name, level, parentId } = parsed.data;
    const existingCategory = await prisma.category.findUnique({
        where: { name },
    });

    if (existingCategory) {
        return { error: "A category with that name already exists." };
    }

    let resolvedParentId: number | null = null;

    if (level === "SUBCATEGORY") {
        const parsedParentId = Number(parentId);

        if (!Number.isInteger(parsedParentId)) {
            return {
                error: "Invalid parent category.",
            };
        }

        const parent = await prisma.category.findUnique({
            where: { id: parsedParentId },
            select: {
                id: true,
                parentId: true,
            },
        });

        if (!parent) {
            return { error: "Parent category does not exist." };
        }

        if (parent.parentId !== null) {
            return { error: "Subcategories cannot contain other subcategories." };
        }

        resolvedParentId = parent.id;
    }

    await prisma.category.create({
        data: { name, parentId: resolvedParentId },
    });

    revalidatePath("/settings/inventory");
    revalidatePath("/inventory");
    revalidatePath("/inventory/[id]", "page");

    return { success: level === "CATEGORY" ? `${name} was created successfully.` : `${name} was created successfully as a subcategory.` };
}

export async function deleteCategory(categoryId: number): Promise<void> {
    await requireInventoryManager();

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            _count: {
                select: {
                    children: true,
                    items: true,
                },
            },
        },
    });

    if (!category) {
        return;
    }

    if (category._count.children > 0) {
        throw new Error("A category containing subcategories cannot be deleted.");
    }

    if (category._count.items > 0) {
        throw new Error("A subcategory containing inventory items cannot be deleted.");
    }

    await prisma.category.delete({
        where: { id: categoryId },
    });

    revalidatePath("/settings/inventory");
    revalidatePath("/inventory");
    revalidatePath("/inventory/[id]", "page");
}