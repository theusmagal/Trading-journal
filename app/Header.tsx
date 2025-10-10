'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const authed = status === 'authenticated';

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  }

  const linkBase = 'hover:underline transition';
  const isActive = (href: string) =>
    pathname === href ? 'text-emerald-300' : 'text-zinc-200';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition
        ${scrolled ? 'bg-zinc-900/60 border-b border-white/10' : 'bg-transparent'}`}
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center" aria-label="TradePulse home">
        <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
        TradePulse
        </span>
        </Link>



        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main">
          <Link href="/pricing" className={`${linkBase} ${isActive('/pricing')}`}>Pricing</Link>
          <Link href="/#features" className={linkBase}>Features</Link>

          {!authed ? (
            <>
              <Link href="/auth/login" className={`${linkBase} ${isActive('/auth/login')}`}>Login</Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 rounded-md bg-emerald-500 text-zinc-900 font-medium"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={`${linkBase} ${isActive('/dashboard')}`}>Dashboard</Link>
              <button onClick={handleSignOut} className="hover:underline text-zinc-200" aria-label="Sign out">
                Sign out
              </button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/15"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="i" aria-hidden>
            {/* simple hamburger */}
            <div className="w-4 h-[2px] bg-zinc-200" />
            <div className="w-4 h-[2px] bg-zinc-200 my-[5px]" />
            <div className="w-4 h-[2px] bg-zinc-200" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-zinc-900/70 backdrop-blur-md">
          <nav className="mx-auto max-w-6xl px-6 py-3 flex flex-col gap-3 text-sm" aria-label="Mobile">
            <Link href="/pricing" className={`${linkBase} ${isActive('/pricing')}`}>Pricing</Link>
            <Link href="/#features" className={linkBase}>Features</Link>

            {!authed ? (
              <>
                <Link href="/auth/login" className={`${linkBase} ${isActive('/auth/login')}`}>Login</Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 rounded-md bg-emerald-500 text-zinc-900 font-medium text-center"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`${linkBase} ${isActive('/dashboard')}`}>Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="text-left hover:underline text-zinc-200"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
