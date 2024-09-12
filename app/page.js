'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

import TransitioningText from './components/TransitioningText'

const HeartAnimation = dynamic(() => import('./components/HeartAnimation'), { 
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
  {isClient && <div className="flex-grow"><HeartAnimation /></div>}
  <div className="absolute inset-x-0 top-[10%] flex items-center justify-center">
        <div className="text-center">
      <h1 className="text-6xl font-bold text-holly mb-4">Keen</h1>
      <TransitioningText />
      </div>
  </div>
</div>
    </main>
  )
}