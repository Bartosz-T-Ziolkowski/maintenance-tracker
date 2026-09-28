import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "The Angelus Maintenance",
  description: "Maintenance request tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <Image
            src="/angelus-logo.png"
            alt="The Angelus"
            width={220}
            height={75}
            priority
            className="h-auto w-[180px] sm:w-[220px]"
          />
        </header>

        {children}
      </body>
    </html>
  );
}