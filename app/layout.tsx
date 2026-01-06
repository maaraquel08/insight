import type { Metadata } from "next";
import { Rubik, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SideNav } from "@/components/side-nav";

const rubik = Rubik({
    subsets: ["latin"],
    variable: "--font-rubik",
    display: "swap",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-roboto-mono",
    display: "swap",
});

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
            <body className={`${rubik.variable} ${robotoMono.variable}`}>
                <Providers>
                    <SideNav />
                    <div className="ml-16 mx-auto">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
