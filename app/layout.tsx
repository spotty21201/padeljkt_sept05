import type { Metadata } from "next";
import "@/styles/theme.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const pj = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","600","700"] });

export const metadata: Metadata = {
  title: "PadelJKT Simulator",
  description: "Predictive design & yield analysis for padel venues",
  themeColor: "#0A0A0A"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={pj.className}>{children}</body>
    </html>
  );
}

