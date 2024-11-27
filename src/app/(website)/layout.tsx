import "@/app/globals.css";
import localFont from 'next/font/local'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <body>
        {children}       
      </body>
    </html>
  );
}
