import "./globals.css";

export const metadata = {
  title: "50 Micro SaaS Ideas You Can Build Without Coding",
  description: "Discover 50 practical Micro SaaS ideas you can explore without coding. Get the complete PDF eBook.",
  openGraph: {
    title: "50 Micro SaaS Ideas You Can Build Without Coding",
    description: "Discover 50 practical Micro SaaS ideas you can explore without coding. Get the complete PDF eBook.",
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
