'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Edit3, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminToolbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Check if user is logged in and is an admin
  // Note: Adjust the role check based on your actual session object structure
  const isAdmin = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'MANAGER';

  if (!isAdmin) return null;

  return (
    <div className="bg-[#0f172a] text-white py-2.5 px-6 flex items-center justify-end gap-8 text-[13px] font-medium z-[9999] relative border-b border-slate-800">
      <div className="flex items-center gap-6 mr-auto md:mr-0">
        <Link
          href={`${pathname}?edit=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-yellow-400 transition-all group"
        >
          <Edit3 size={15} className="text-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Edit Page</span>
          <ExternalLink size={13} className="opacity-40" />
        </Link>
      </div>
    </div>
  );
}
