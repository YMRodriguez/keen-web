'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

const ButtonAttractorAnimation = dynamic(() => import('./components/ButtonAttractorAnimation'), { 
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
    <>
      <Head>
        <link rel="preload" href="https://fonts.gstatic.com/s/bellotatext/v14/0FlMVP2VnlWS4f3-UE9hHXM5VfsqfQXwQy6yxg.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="https://fonts.gstatic.com/s/bellota/v14/MwQ2bhXl3_qEpiwAKJBbtQ.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="https://fonts.gstatic.com/s/zenloop/v5/h0GrssK16UsnJwHsEK9zqwzNiA.woff2" as="font" type="font/woff2" crossorigin />
      </Head>

      <main>
        <div className={`relative h-screen flex flex-col overflow-hidden ${!fontsLoaded ? 'hidden-until-fonts-loaded' : ''}`}>
          {isClient && (
            <div className="absolute inset-0">
              <ButtonAttractorAnimation buttonPosition={buttonPosition} />
            </div>
          )}

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
    </>
  )
}
