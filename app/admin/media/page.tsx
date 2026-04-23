import { Suspense } from "react";
import AdminMediaClient from "./MediaClient";

export default function AdminMediaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500">Loading media manager...</div>}>
      <AdminMediaClient />
    </Suspense>
  );
}
