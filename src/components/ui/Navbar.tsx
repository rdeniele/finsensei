'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  HomeIcon,
  WalletIcon,
  FlagIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAdmin = user?.email === 'work.rparagoso@gmail.com';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Accounts', href: '/accounts', icon: BanknotesIcon },
    { name: 'Transactions', href: '/transactions', icon: WalletIcon },
    { name: 'Goals', href: '/goals', icon: FlagIcon },
    { name: 'Buy Coins', href: '/coins', icon: CurrencyDollarIcon },
    { name: 'Settings', href: '/settings/profile', icon: Cog6ToothIcon },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                {isSidebarOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              <Link href="/dashboard" className="ml-4 flex items-center">
                <Image
                  src="/finsensei.png"
                  alt="FinSensei Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FinSensei</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <ShieldCheckIcon className="h-6 w-6" />
                </Link>
              )}
              <ThemeToggle />
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">Profile</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="/settings/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/finsensei.png"
              alt="FinSensei Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FinSensei</span>
          </Link>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`mr-4 h-6 w-6 ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-200'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive('/admin')
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ShieldCheckIcon
                className={`mr-4 h-6 w-6 ${
                  isActive('/admin')
                    ? 'text-blue-600 dark:text-blue-200'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }`}
              />
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Add padding to main content to account for fixed navbar */}
      <div className="h-16" />
    </>
  );
} 