'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const authed = status === 'authenticated';
  const router = useRouter();

  async function handleSignOut() {
    // Don’t let NextAuth do a full redirect; we control it
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh(); // ensure fresh header immediately
  }

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-semibold">Trading Journal</Link>
      <nav className="space-x-4">
        {!authed ? (
          <>
            <Link className="underline" href="/auth/login">Login</Link>
            <Link className="underline" href="/auth/register">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm">{session?.user?.email}</span>
            <Link className="underline" href="/dashboard">Dashboard</Link>
            <button onClick={handleSignOut} className="underline">Sign out</button>
          </>
        )}
      </nav>
    </header>
  );
}
