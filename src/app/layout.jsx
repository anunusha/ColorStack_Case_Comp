import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TaxBridge",
  description: "A guided tool for finding tax credits and refund opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
