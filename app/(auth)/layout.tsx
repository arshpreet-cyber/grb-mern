import { Suspense } from "react";
import WebsiteLayout from "@/components/layout/WebsiteLayout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WebsiteLayout>{children}</WebsiteLayout>
    </Suspense>
  );
}
