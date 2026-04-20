import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps, } from "@mantine/core";
import { Inter } from "next/font/google";
import { theme } from "../theme";
import { useTranslations } from "next-intl";
import ClientLayout from "../components/ClientLayout";

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: "WuChang 無常",
  description: "The No.1 AI Financial Platform",
};

export default function RootLayout({ children }: { children: any }) {
  const t = useTranslations('common');

  return (
    <html lang="en" {...mantineHtmlProps} className={inter.className}>
      <head>
        <title>WuChang 無常</title>
        <meta name="description" content="The No.1 AI Financial Platform" />
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/brandIcons/brandwithName.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      
      <body>
        <MantineProvider theme={theme}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
