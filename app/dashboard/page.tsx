import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="p-8">
        <p>You must be signed in.</p>
        <Link className="underline" href="/auth/login">Go to login</Link>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome, {session.user?.email}</p>
    </div>
  );
}
