'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { detect } from 'detect-browser'

const browser = detect()
const isMobile = browser && (browser.os === 'iOS' || browser.os === 'Android OS')

const BASE_PARTICLE_COUNT = isMobile ? 5000 : 10000
const ATTRACTOR_COUNT = 50  // Increased number of attractors

function Particles() {
  const particlesRef = useRef()
  const velocitiesRef = useRef()
  const [particleCount, setParticleCount] = useState(BASE_PARTICLE_COUNT)
  const particleCountRef = useRef(particleCount)

  const { gl } = useThree()

  useEffect(() => {
    // Safely check GPU capabilities and adjust particle count
    const checkGPUCapabilities = () => {
      try {
        const extension = gl.getExtension('WEBGL_debug_renderer_info')
        if (extension) {
          const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
          if (renderer.includes('Apple') || renderer.includes('Mali') || renderer.includes('Adreno')) {
            setParticleCount(BASE_PARTICLE_COUNT / 4)
          }
        }
      } catch (error) {
        console.warn('Unable to check GPU capabilities:', error)
      }
    }

    checkGPUCapabilities()
  }, [gl])

  useEffect(() => {
    particleCountRef.current = particleCount
  }, [particleCount])

  const attractorPositions = useMemo(() => {
    const positions = new Float32Array(ATTRACTOR_COUNT * 3)
    for (let i = 0; i < ATTRACTOR_COUNT; i++) {
      // Distribute attractors randomly near the center
      positions[i * 3] = (Math.random() - 0.5) * 2 // X between -1 and 1
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 // Y between -1 and 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 // Z between -1 and 1
    }
    return positions
  }, [])

  const particlePool = useMemo(() => new Float32Array(BASE_PARTICLE_COUNT * 3 * 1.5), [])

  useEffect(() => {
    const particles = particlesRef.current

    // Initialize particles
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    velocitiesRef.current = new Float32Array(particleCount * 3)

    const color = new THREE.Color("#A2A3BC") // Updated particle color

    for (let i = 0; i < particleCount; i++) {
      initializeParticle(positions, velocitiesRef.current, i)
      color.toArray(colors, i * 3)
    }

    particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [particleCount])

  const initializeParticle = (positions, velocities, index) => {
    const radius = 30 + Math.random() * 20 // Particles start further out
    const theta = Math.acos(2 * Math.random() - 1) // Random angle from 0 to PI
    const phi = 2 * Math.PI * Math.random() // Random angle from 0 to 2PI

    positions[index * 3] = radius * Math.sin(theta) * Math.cos(phi)
    positions[index * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[index * 3 + 2] = radius * Math.cos(theta)

    velocities[index * 3] = 0
    velocities[index * 3 + 1] = 0
    velocities[index * 3 + 2] = 0
  }

  useFrame(() => {
    const particles = particlesRef.current
    const positions = particles.geometry.attributes.position.array
    const velocities = velocitiesRef.current

    for (let i = 0; i < particleCountRef.current; i++) {
      let totalForceX = 0
      let totalForceY = 0
      let totalForceZ = 0

      // Calculate attraction to multiple attractors
      for (let j = 0; j < ATTRACTOR_COUNT; j++) {
        const dx = attractorPositions[j * 3] - positions[i * 3]
        const dy = attractorPositions[j * 3 + 1] - positions[i * 3 + 1]
        const dz = attractorPositions[j * 3 + 2] - positions[i * 3 + 2]
        const distanceSquared = dx * dx + dy * dy + dz * dz + 0.1 // Avoid division by zero

        const distance = Math.sqrt(distanceSquared)
        let force = 0

        if (distance > 5) {
          // Attraction force when far from the center
          force = 0.0001 / distanceSquared
        } else {
          // Bounce-back effect when too close to the center
          const repelStrength = 0.001 // Adjust repel strength as needed
          force = -repelStrength / (distanceSquared)
        }

        totalForceX += dx * force
        totalForceY += dy * force
        totalForceZ += dz * force
      }

      velocities[i * 3] += totalForceX
      velocities[i * 3 + 1] += totalForceY
      velocities[i * 3 + 2] += totalForceZ

      // Apply velocity with damping
      const damping = 0.99 // Increased damping for smoother motion
      velocities[i * 3] *= damping
      velocities[i * 3 + 1] *= damping
      velocities[i * 3 + 2] *= damping

      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Boundary check and reinitialization
      const bound = 1000 // Increased bound to prevent early reinitialization
      const distanceFromCenterSquared =
        positions[i * 3] * positions[i * 3] +
        positions[i * 3 + 1] * positions[i * 3 + 1] +
        positions[i * 3 + 2] * positions[i * 3 + 2]

      if (distanceFromCenterSquared > bound * bound) {
        initializeParticle(positions, velocities, i)
      }
    }

    particles.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial 
          size={0.3} // Particle size
          transparent 
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  )
}

const MainAnimation = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, -5, 120], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles />
      </Canvas>
      {/* Button Overlay */}
    </div>
  )
}

export default MainAnimation
