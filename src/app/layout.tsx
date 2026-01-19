import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stellar OSS Issues",
  description: "Find your next open source contribution in the Stellar ecosystem",
  icons: {
    icon: '/stellar-ambassador-seal-yellow.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
