import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.scss";
import StoreProvider from "@/components/StoreProvider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Weather in Cities",
  description: "Track weather in your favorite cities",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
