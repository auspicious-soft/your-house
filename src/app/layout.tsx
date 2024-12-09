import 'react-tippy/dist/tippy.css';
import { Toaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import localFont from 'next/font/local'
import type { Metadata } from "next";

const SFProDisplay = localFont({
  src: '../assets/fonts/SfProDisplayRegular.otf', //400
  display: 'swap',
  variable: '--font-SF-Pro-Display', 
})
const SFProDisplaySemibold = localFont({
  src: '../assets/fonts/SFProDisplaySemibold.otf', 
  display: 'swap',
  variable: '--font-SF-Pro-Display-Semibold', 
})
const SFProDisplayMedium = localFont({
  src: '../assets/fonts/SFProDisplayMedium.otf',  //500
  display: 'swap',
  variable: '--font-SF-Pro-Display-Medium', 
})
const SFProDisplayBold = localFont({
  src: '../assets/fonts/SFProDisplayBold.otf', 
  display: 'swap',
  variable: '--font-SF-Pro-Display-Bold', 
})
const SFProDisplayThin = localFont({
  src: '../assets/fonts/SFProDisplayThin.otf', 
  display: 'swap',
  variable: '--font-SF-Pro-Display-Thin', 
})


export const metadata: Metadata = {
  title: "Your House",
  description: " ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <SessionProvider>
        <Toaster richColors />
        <body className={`${SFProDisplay.variable} ${SFProDisplaySemibold.variable} ${SFProDisplayMedium.variable} ${SFProDisplayBold.variable} ${SFProDisplayThin.variable}`}>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
