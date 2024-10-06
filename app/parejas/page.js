'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'

const ButtonAttractorAnimation = dynamic(() => import('../components/ButtonAttractorAnimation'), { 
  ssr: false,
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false) // New state for fonts
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, z: 0 })
  const buttonRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

    // Check if fonts have loaded
    useEffect(() => {
      document.fonts.ready.then(() => {
        setFontsLoaded(true)
      })
    }, [])

  useEffect(() => {
    const updateButtonPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = (rect.left + rect.right) / 2 / window.innerWidth * 2 - 1
        const y = -((rect.top + rect.bottom) / 2 / window.innerHeight * 2 - 1)
        setButtonPosition({ x, y, z: 0 })
      }
    }

    updateButtonPosition()
    window.addEventListener('resize', updateButtonPosition)
    return () => window.removeEventListener('resize', updateButtonPosition)
  }, [])

  return (
    <main className={!fontsLoaded ? 'hidden-until-fonts-loaded' : ''}>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {isClient && (
          <div className="absolute inset-0">
            <ButtonAttractorAnimation buttonPosition={buttonPosition} />
          </div>
        )}

        <div className="absolute inset-x-0 top-[45%] flex items-center justify-center z-10">
          <a
            ref={buttonRef}
            href="https://lv4iyra4d6r.typeform.com/to/x95yF15X"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-black font-bellotaText font-semibold rounded-full shadow-lg"
            style={{
              backgroundColor: '#D0B4E4',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)', // Added glow effect

            }}
          >
            Haz la encuesta
          </a>
        </div>

        <div className="absolute inset-x-0 top-[10%] flex items-center justify-center z-20">
          <div className="text-center">
            <h1 className="text-black text-9xl font-light mb-2">
              <span className="font-zen text-[12rem]">K</span>
              <span className="font-bellota text-7xl">een</span>
            </h1>
            <p className="text-black mb-2 font-bellota text-lg">Understanding togetherness</p>
          </div>
        </div>
      </div>
    </main>
  )
}