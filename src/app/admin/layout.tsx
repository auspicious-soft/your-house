import type { Metadata } from "next";
import SideNav from "@/app/admin/components/SideNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "./components/Header";
import AdminMobileHeader from "./components/AdminMobileHeader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const notUserOrAdmin = ['user']
  // ['therapist', 'client']

  if (!session) {
    redirect("/")
  }
  else if (!notUserOrAdmin.includes((session as any)?.user?.role)) {
    return (
      <html lang="en">
        <body>
          <div className=" w-full lg:h-screen  lg:flex-row lg:overflow-hidden">
            <div className="flex-none hidden h-[100vh] lg:block float-left w-[270px]">
              <SideNav />
            </div>
            <div className="w-full lg:hidden">
           <AdminMobileHeader/>
            </div>
          <div className="float-left w-full lg:w-[calc(100%-270px)] ">
            <Header />
            <main className="p-[15px] lg:h-[calc(100vh-116px)]  pb-10 overflo-custom md:overflow-y-auto lg:pb-10 lg:px-[40px]">
              {children}
            </main>
       </div>
          </div>
        </body>
      </html>
    );
  } else {
    return (
      <div className="p-3 bg-black h-screen text-white">
        You are not authorized to view this page click
        <Link href="/" className="p-3 text-black bg-white">
          Login
        </Link>
      </div>
    );
  }
}
