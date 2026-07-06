"use client";

import dynamic from "next/dynamic";

const CookieConsentModal = dynamic(
  () =>
    import("@/frontend/components/CookieConsentModal").then((mod) => ({
      default: mod.CookieConsentModal,
    })),
  { ssr: false }
);

const ServiceWorkerRegistration = dynamic(
  () =>
    import("@/frontend/components/ServiceWorkerRegistration").then((mod) => ({
      default: mod.ServiceWorkerRegistration,
    })),
  { ssr: false }
);

export function DynamicLayoutComponents() {
  return (
    <>
      <CookieConsentModal />
      <ServiceWorkerRegistration />
    </>
  );
}

