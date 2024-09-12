import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";

import { Merriweather } from 'next/font/google'

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${merriweather.variable}`}>
      <body className="font-serif">
        <Navbar />
        {children}
      </body>
    </html>
  )
}