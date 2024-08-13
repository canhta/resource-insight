import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import cx from 'classnames';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SETA - Resource Insight',
  description: 'Resource Insight Dashboard',
};

const routes: { route: string; label: string }[] = [
  { label: 'Dashboard', route: '/' },
  { label: 'Org Chart', route: '/org-chart' },
  { label: 'Headcount', route: '/headcount' },
  { label: 'Skill Chart', route: '/skills' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className='flex gap-4 p-4 border-b'>
          {routes.map((item) => (
            <Link
              key={item.route}
              href={item.route}
              className={cx('bg-slate-200 rounded p-2 hover:bg-slate-300', {
              })}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
