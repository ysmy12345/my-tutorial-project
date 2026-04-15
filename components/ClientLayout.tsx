"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Storage } from "../utils/storage";

// Import all locale messages
import enLocales from "../locales/en.json";
import zhLocales from "../locales/zh.json";

const messagesMap: Record<string, any> = {
    en: enLocales,
    zh: zhLocales
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState("en"); // Default language
    const [messages, setMessages] = useState(messagesMap["en"]); // Default messages

    // Load locale on mount
    useEffect(() => {
        const storedLocale = Storage.getLocale() || "en";
        setLocale(storedLocale);
        setMessages(messagesMap[storedLocale] || messagesMap["en"]);
    }, []);

    return (
        <Elements stripe={stripePromise}>
            <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Singapore">
                {children}
            </NextIntlClientProvider>
        </Elements>
    );
}
