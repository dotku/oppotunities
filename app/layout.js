import "./globals.css";
import Navigation from "./components/Navigation";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "JobMatching Platform",
  description:
    "JobMatching - Find your perfect job match with intelligent matching technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
