import Providers from "@/store/Providers";
import "./globals.css";

export const metadata = {
  title: "My App",
  description: "Using Redux with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
