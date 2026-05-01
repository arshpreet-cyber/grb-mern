import WebsiteLayout from "@/components/layout/WebsiteLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WebsiteLayout>{children}</WebsiteLayout>;
}
