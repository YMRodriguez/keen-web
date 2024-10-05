'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'


const MainAnimation = dynamic(() => import('../components/MainAnimationEsp'), { 
  ssr: false,
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Render the animation */}
        {isClient && (
          <div className="flex-grow">
            <MainAnimation />
          </div>
        )}

        {/* Adjusted Button Position */}
        <div className="absolute inset-x-0 top-[55%] flex items-center justify-center z-10">
          <a
            href="https://lv4iyra4d6r.typeform.com/to/x95yF15X"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-black font-semibold rounded-full shadow-lg"
            style={{
              backgroundColor: '#DED0E7',
              borderColor: '#A2A3BC',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
          >
            Haz la encuesta
          </a>
        </div>

        {/* Adjusted Existing Content Position */}
        <div className="absolute inset-x-0 top-[15%] flex items-center justify-center z-20">
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