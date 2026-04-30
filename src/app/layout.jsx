import "./globals.css";

export const metadata = {
  title: "TaxBridge",
  description: "A guided tool for finding tax credits and refund opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
