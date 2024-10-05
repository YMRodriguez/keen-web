'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'


const MainAnimation = dynamic(() => import('./components/MainAnimation'), { 
  ssr: false,
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main>
      <div className="relative h-screen flex flex-col">
        {isClient && <div className="flex-grow"><MainAnimation /></div>}
        <div className="absolute inset-x-0 top-[10%] flex items-center justify-center">
        <div className="text-center">
        <h1 className="text-black text-9xl font-light mb-4">
          <span className="font-zen text-[14rem]">K</span>
          <span className="font-bellotaText text-9xl">een</span>
        </h1>
      <p className="text-black mb-4 font-bellota text-2xl">Understanding togetherness</p>
      </div>
  </div>
</div>
    </main>
  )
}