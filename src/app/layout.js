import "./globals.css";

export const metadata = {
  title: "ebook.pdf.com",
  description: "ebook.pdf.com",
  openGraph: {
    title: "ebook.pdf.com",
    description: "ebook.pdf.com",
    images: [{
      url: '/cover-placeholder.png',
      width: 800,
      height: 600,
    }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
