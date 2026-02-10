import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AccountSidebar from "@/components/account/AccountSidebar";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/account");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-64 flex-shrink-0">
                    <AccountSidebar user={session.user} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
