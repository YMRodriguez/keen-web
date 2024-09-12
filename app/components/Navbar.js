'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="bg-black-white">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="font-extralight text-xl text-claret">Built to last</Link>
        <div className="space-x-4">
          {pathname === '/why' && (
            <Link href="/" className="text-holly hover:text-claret">Get the app</Link>
          )}
          <Link href="/why" className="text-holly hover:text-claret">Why?</Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar