import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Raleway, Unbounded } from "next/font/google";
import './globals.css';

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-bricolage'
});

const raleway = Raleway({
  weight: ['400', '800'],
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});


const unbounded = Unbounded({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-unbounded'
});

const dm_sans = DM_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-dmsans'
})

export const metadata: Metadata = {
  title: 'MinoManager',
  description: 'Inventory management system for FRC Minotaur 1369',
}

export default function RootLayout({ children } : Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${unbounded.variable} ${raleway.variable} ${dm_sans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}