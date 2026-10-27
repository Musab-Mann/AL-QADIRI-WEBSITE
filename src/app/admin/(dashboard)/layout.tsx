import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/server/require-admin.ts';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Middleware already blocks unauthenticated requests to /admin/*, but this layout checks again
  // server-side (defense in depth) and is also where we read the username to display.
  const session = await requireAdmin();
  if (!session) redirect('/admin/login');

  return <AdminShell username={session.username}>{children}</AdminShell>;
}
