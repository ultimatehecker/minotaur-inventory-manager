import { redirect } from "next/navigation";
import { authenticate } from "@/lib/session";

export default async function Settings() {
    const session = await authenticate();

    if (!session) {
        redirect("/login");
    }

    if (session.user.role === "ADMINISTRATOR") {
        redirect("/settings/accounts");
    }

    if (session.user.role === "MANAGER") {
        redirect("/settings/inventory");
    }

    redirect("/");
}