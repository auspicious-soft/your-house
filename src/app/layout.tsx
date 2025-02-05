import "react-tippy/dist/tippy.css";
import { Toaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Providers from "./(website)/components/ProgressBarProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { auth } from "@/auth";

const SFProDisplay = localFont({
  src: "../assets/fonts/SfProDisplayRegular.otf",
  display: "swap",
  variable: "--font-SF-Pro-Display",
});
const SFProDisplaySemibold = localFont({
  src: "../assets/fonts/SFProDisplaySemibold.otf",
  display: "swap",
  variable: "--font-SF-Pro-Display-Semibold",
});
const SFProDisplayMedium = localFont({
  src: "../assets/fonts/SFProDisplayMedium.otf",
  display: "swap",
  variable: "--font-SF-Pro-Display-Medium",
});
const SFProDisplayBold = localFont({
  src: "../assets/fonts/SFProDisplayBold.otf",
  display: "swap",
  variable: "--font-SF-Pro-Display-Bold",
});
const SFProDisplayThin = localFont({
  src: "../assets/fonts/SFProDisplayThin.otf",
  display: "swap",
  variable: "--font-SF-Pro-Display-Thin",
});

export const metadata: Metadata = {
  title: "Your House",
  description: " ",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const session = await auth();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${SFProDisplay.variable} ${SFProDisplaySemibold.variable} ${SFProDisplayMedium.variable} ${SFProDisplayBold.variable} ${SFProDisplayThin.variable}`}
      >
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              {children}
            <Toaster richColors />
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
