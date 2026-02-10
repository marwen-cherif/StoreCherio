import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check authentication
    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/admin");
    }

    // Check admin role
    const userRole = session.user.role;
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        redirect("/?error=unauthorized");
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <AdminSidebar user={session.user} />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
