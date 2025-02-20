import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`relative min-h-screen ${inter.className}`}>
      {children}
    </div>
  );
} 