'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { status } = useSession();
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

  useEffect(() => { setOpen(false); }, [pathname]);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  }

  const linkBase =
    'transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-sm';
  const isActive = (href: string) =>
    pathname === href ? 'text-emerald-300' : 'text-zinc-200';

  return (
    <header
      role="banner"
      className={[
        'sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-transparent transition',
        scrolled
          ? 'border-b border-white/10 bg-zinc-900/70 shadow-[0_0_25px_rgba(16,185,129,0.08)]'
          : 'bg-transparent'
      ].join(' ')}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Brand with ECG pulse line */}
        <Link href="/" className="flex items-center gap-2" aria-label="TradePulse home">
          {/* Red pulse line (ECG) */}
          <svg
            viewBox="0 0 64 24"
            className="h-4 md:h-5 w-auto pulse-ecg"
            aria-hidden="true"
          >
            {/* the line */}
            <path
              d="M1 12 H12 L16 6 L20 22 L26 2 L30 14 L34 10 L38 12 H63"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* wordmark */}
          <span
            className="text-lg font-semibold tracking-tight text-emerald-400"
            style={{ textShadow: '0 0 8px rgba(16,185,129,.4)' }}
          >
            TradePulse
          </span>
        </Link>


        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
          <Link
            href="/pricing"
            aria-current={pathname === '/pricing' ? 'page' : undefined}
            className={`${linkBase} ${isActive('/pricing')}`}
          >
            Pricing
          </Link>

          {/* Hash links never match pathname; keep neutral */}
          <Link href="/#features" className={`text-zinc-200 ${linkBase}`}>
            Features
          </Link>

          {!authed ? (
            <>
              <Link
                href="/auth/login"
                aria-current={pathname === '/auth/login' ? 'page' : undefined}
                className={`${linkBase} ${isActive('/auth/login')}`}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 rounded-md bg-emerald-500 text-zinc-900 font-medium
                           hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-emerald-400/70"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                aria-current={pathname === '/dashboard' ? 'page' : undefined}
                className={`${linkBase} ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-zinc-200 hover:underline focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-sm"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 md:hidden
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Menu</span>
          <div aria-hidden className="space-y-1.5">
            <div className="h-[2px] w-5 bg-zinc-200" />
            <div className="h-[2px] w-5 bg-zinc-200" />
            <div className="h-[2px] w-5 bg-zinc-200" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-zinc-900/70 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 text-sm" aria-label="Mobile">
            <Link
              href="/pricing"
              aria-current={pathname === '/pricing' ? 'page' : undefined}
              className={`${linkBase} ${isActive('/pricing')}`}
            >
              Pricing
            </Link>
            <Link href="/#features" className={`text-zinc-200 ${linkBase}`}>Features</Link>

            {!authed ? (
              <>
                <Link
                  href="/auth/login"
                  aria-current={pathname === '/auth/login' ? 'page' : undefined}
                  className={`${linkBase} ${isActive('/auth/login')}`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-emerald-500 px-3 py-2 text-center font-medium text-zinc-900
                             hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-emerald-400/70"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  aria-current={pathname === '/dashboard' ? 'page' : undefined}
                  className={`${linkBase} ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-zinc-200 hover:underline focus-visible:outline-none
                             focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-sm"
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
