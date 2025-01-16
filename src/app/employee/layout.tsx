import type { Metadata } from "next";
import SideNav from "@/app/employee/_components/SideNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminMobileHeader from "../admin/components/AdminMobileHeader";
import Header from "../admin/components/Header";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userRole = (session as any)?.user?.role;
  const restrictedRoles = ['admin', 'user']; // Add other restricted roles as needed
  
  // Check if user has restricted role
  if (restrictedRoles.includes(userRole)) {
    return (
      <html lang="en">
        <body>
          <div className="p-3 bg-black min-h-screen text-white">
            <span>You are not authorized to view this page click{" "}</span>
            <Link href="/" className="p-3 text-black bg-white">
              Login
            </Link>
          </div>
        </body>
      </html>
    );
  }

  // Main admin layout for authorized users
  return (
    <html lang="en">
      <body>
        <div className="w-full lg:h-screen lg:flex-row lg:overflow-hidden">
          {/* Sidebar */}
          <div className="flex-none hidden h-screen lg:block float-left w-[270px]">
            <SideNav />
          </div>
          
          {/* Mobile Header */}
          <div className="w-full lg:hidden">
            <AdminMobileHeader />
          </div>
          
          {/* Main Content */}
          <div className="float-left w-full lg:w-[calc(100%-270px)]">
            <Header />
            <div className="p-4 lg:h-[calc(100vh-116px)] overflow-y-auto pb-10 lg:pb-10 lg:px-10">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}