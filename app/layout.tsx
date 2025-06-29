import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {APP_DESCRIPTION, APP_NAME} from "@/lib/constants";

import React from "react";
import {ThemeProvider} from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: `%s | ${APP_NAME}`,
        default: APP_NAME,
    },
    description: `${APP_DESCRIPTION}`,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${inter.className} antialiased`}
        >
        <ThemeProvider
            attribute={"class"}
            defaultTheme={"light"}
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster
                expand={true}
                position={"top-center"}
                richColors
            />
        </ThemeProvider>
        </body>
        </html>
    );
}
