import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import AccountStatusModal from "@/components/AccountStatusModal";

export const metadata: Metadata = {
  title: "MotoShop – Xe Máy Chính Hãng",
  description: "Website bán xe máy chính hãng Honda, Yamaha, VinFast, Piaggio. Hơn 200+ mẫu xe, giá tốt nhất, giao hàng toàn quốc.",
  keywords: "xe máy, mua xe máy, Honda, Yamaha, VinFast, xe điện, xe số, xe ga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ToastProvider>
          <AccountStatusModal />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
