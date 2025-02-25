import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";

import "@mantine/carousel/styles.css";
// Mantine styles
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import "mantine-react-table/styles.css";

import { SearchParamsNotification } from "@/lib/notification/search-params-notification";
import TanstackQueryProvider from "@/lib/tanstack-query/provider";
import {
  ColorSchemeScript,
  createTheme,
  DEFAULT_THEME,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Website Title",
    default: "APPA FOOTBALL SCHOOL",
  },
  description:
    "APPA Football School merupakan sekolah sepak bola yang menggabungkan pelatihan sepakbola tradisional dengan teknologi canggih untuk meningkatkan keterampilan dan performa pemain.",
};

const mantineTheme = createTheme({
  fontFamily: `${unbounded.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  headings: {
    fontFamily: `${unbounded.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body
        suppressHydrationWarning
        className={`${unbounded.variable} font-sans antialiased`}
      >
        <NextTopLoader />

        <TanstackQueryProvider>
          <MantineProvider theme={mantineTheme} defaultColorScheme="light">
            <ModalsProvider>
              <Notifications
                position="top-right"
                zIndex={1000}
                autoClose={10000}
              />

              <Suspense>
                <SearchParamsNotification />
              </Suspense>

              {children}
            </ModalsProvider>
          </MantineProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
