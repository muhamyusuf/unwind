import Link from 'next/link';
import { Icons } from './Icons';
import { buttonVariants } from './ui/Button';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { UserAccountNav } from './UserAccountNav';
import SearchBar from './SearchBar';

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="fixed top-0 inset-x-0 h-fit bg-white border-b border-gray-200 dark:border-slate-800 z-[10] py-2 dark:bg-slate-900">
      <div className="container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-bold text-black dark:text-white md:block">
            Unwind
          </p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
