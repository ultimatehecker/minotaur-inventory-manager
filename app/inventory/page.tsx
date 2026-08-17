import Link from "next/link";
import prisma from "@/prisma/prisma";
import Navbar from "@/components/navbar";

export default async function Inventory() {
    const categories = await prisma.category.findMany({
        where: { parentId: null, },
        orderBy: { name: "asc" },
        include: {
        _count: {
            select: {
            children: true,
            items: true,
            },
        },
        },
    });

    return (
        <>
        <Navbar />
        <main className="inventory-page">
            <div className="inventory-container">
                <h1 className="inventory-title">Inventory</h1>

                {categories.length === 0 ? (
                    <p className="text-center text-sm text-fg-muted">There are currently no inventory categories.</p>
                ) : (
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/inventory/${category.id}`} className="category-card">
                            <div>
                                <h2 className="text-lg font-semibold uppercase tracking-wide">{category.name}</h2>
                                <p className="mt-2 text-xs text-fg/70">{category._count.children > 0 ? `${category._count.children} subcategories` : `${category._count.items} parts`}</p>
                            </div>

                            <span className="text-xs font-medium uppercase tracking-wide">View Parts{" "}
                                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </span>
                        </Link>
                    ))}
                    </section>
                )}
            </div>
        </main>
        </>
    );
}