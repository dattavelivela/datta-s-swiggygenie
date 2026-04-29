import "./globals.css";

export const metadata = {
  title: "Swiggy Genie",
  description: "A mobile-first Swiggy Meal Autopilot powered by Swiggy MCP."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
