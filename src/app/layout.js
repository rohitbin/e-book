import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ebook.pdf.com",
  description: "ebook.pdf.com",
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: "ebook.pdf.com",
    description: "ebook.pdf.com",
    images: [{
      url: '/logo.jpg',
      width: 800,
      height: 800,
    }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
