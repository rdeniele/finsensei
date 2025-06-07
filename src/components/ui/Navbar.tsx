import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">FinSensei</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 