import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SideNav } from "@/components/side-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "React Reports Builder",
    description: "A Next.js application with Redux and Shadcn UI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <SideNav />
                    <div className="ml-16 mx-auto">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
