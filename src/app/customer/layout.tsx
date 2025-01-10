import type { Metadata } from "next";
import SideNav from "@/app/customer/components/SideNav";
import MobileHeader from "@/app/customer/components/MobileHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/app/customer/components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Check if user role is not "user"
  const isNotAuthorized = (session as any)?.user?.role !== "user";

  return (
    <html lang="en">
      <body>
        {isNotAuthorized ? (
          <div className="p-3 bg-black min-h-screen text-white">
            <span>You are not authorized to view this page click{" "}</span>
            <Link href="/" className="p-3 text-black bg-white">
              Login
            </Link>
          </div>
        ) : (
          <div className="w-full lg:h-screen lg:flex-row lg:overflow-hidden">
            <div className="flex-none hidden h-screen lg:block float-left w-[270px]">
              <SideNav />
            </div>
            <div className="w-full lg:hidden">
              <MobileHeader />
            </div>
            <div className="float-left w-full lg:w-[calc(100%-270px)]">
              <Header />
              <main className="p-4 lg:h-[calc(100vh-116px)] overflow-y-auto pb-10 lg:pb-10 lg:px-10">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}