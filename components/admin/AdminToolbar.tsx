'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Edit3, Copy, ExternalLink } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AdminToolbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  // Check if user is logged in and is an admin
  // Note: Adjust the role check based on your actual session object structure
  const isAdmin = session?.user?.role === 'ADMIN' || (session?.user as any)?.role === 'MANAGER';

  if (!isAdmin) return null;

  return (
    <div className="bg-[#0f172a] text-white py-2.5 px-6 flex items-center justify-end gap-8 text-[13px] font-medium z-[9999] relative border-b border-slate-800">
      <div className="flex items-center gap-6 mr-auto md:mr-0">
        <button 
          onClick={() => alert('Duplicate Page logic will be implemented here')}
          className="flex items-center gap-2 hover:text-blue-300 transition-all group"
        >
          <Copy size={15} className="text-slate-400 group-hover:text-blue-300" />
          <span>Duplicate Page</span>
          <ExternalLink size={13} className="opacity-40" />
        </button>

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
