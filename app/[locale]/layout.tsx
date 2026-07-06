import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ErrorBoundary } from "@/frontend/components/ErrorBoundary";
import { ClientLayout } from "@/frontend/components/ClientLayout";
import { ConditionalHeader, ConditionalFooter } from "@/frontend/components/ConditionalLayout";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-plus-jakarta",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Common' });

    return {
        metadataBase: new URL("https://abdoulmalik.com"),
        title: {
            default: "Abdoul Malik AKOGO | Product Manager & Technology Strategist",
            template: `%s | Abdoul Malik AKOGO`
        },
        description: "Portfolio de Abdoul Malik AKOGO, Product Manager et Technology Strategist au Bénin. Praticien qui transmet, entrepreneur qui construit, designer qui code.",
        keywords: ["Product Manager", "Technology Strategist", "Bénin", "Abdoul Malik AKOGO", "Portfolio", "UI/UX", "Tech", "Cotonou"],
        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: "Abdoul Malik AKOGO",
        },
        openGraph: {
            type: "website",
            locale: locale === 'en' ? 'en_US' : 'fr_FR',
            url: "https://abdoulmalik.com",
            siteName: "Abdoul Malik AKOGO",
            title: "Abdoul Malik AKOGO | Product Manager & Technology Strategist",
            description: "Portfolio de Abdoul Malik AKOGO, Product Manager et Technology Strategist au Bénin.",
        }
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#7C3AED",
};

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await props.params;

    // Validate that the incoming `locale` parameter is valid
    if (!SUPPORTED_LANGUAGES.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
            </head>
            <body className={`${plusJakarta.variable} font-sans`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ClientLayout>
                        <ConditionalHeader />
                        <ErrorBoundary>
                            <main className="min-h-screen bg-off-white pb-16 lg:pb-0">{props.children}</main>
                        </ErrorBoundary>
                        <ConditionalFooter />
                    </ClientLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
