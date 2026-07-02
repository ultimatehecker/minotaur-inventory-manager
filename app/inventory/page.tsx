import Navbar from "@/components/navbar";
import prisma from "@/prisma/prisma";
import { Maname } from "next/font/google";

export default async function Inventory() {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-60px)] w-full py-12 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-center text-4xl font-black tracking-[0.1em] mb-16">Inventory</h1>
                </div>
            </main>
        </>
    )
}