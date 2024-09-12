'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { detect } from 'detect-browser'

const browser = detect()
const isMobile = browser && (browser.os === 'iOS' || browser.os === 'Android OS')

const BASE_PARTICLE_COUNT = isMobile ? 10000 : 20000
const ATTRACTOR_COUNT = 50

function createHeartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return [x * scale, y * scale, 0]
}

function Particles() {
    const particlesRef = useRef()
    const attractorsRef = useRef()
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
        const [x, y, z] = createHeartShape((i / ATTRACTOR_COUNT) * Math.PI * 2, 0.2)
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
      }
      return positions
    }, [])
  
    const particlePool = useMemo(() => new Float32Array(BASE_PARTICLE_COUNT * 3 * 1.5), [])
  
    useEffect(() => {
      const particles = particlesRef.current
      const attractors = attractorsRef.current
  
      // Initialize particles
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      velocitiesRef.current = new Float32Array(particleCount * 3)

      const color = new THREE.Color("#7c0728") // More vibrant red color

      for (let i = 0; i < particleCount; i++) {
        initializeParticle(positions, velocitiesRef.current, i)
        color.toArray(colors, i * 3)
      }

      particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      // Set attractor positions
      attractors.geometry.setAttribute('position', new THREE.BufferAttribute(attractorPositions, 3))
    }, [attractorPositions, particleCount])
  
    const initializeParticle = (positions, velocities, index) => {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 2 // Particles around the heart
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = Math.sin(angle) * radius
      positions[index * 3 + 2] = (Math.random() - 0.5) * 2
      velocities[index * 3] = (Math.random() - 0.5) * 0.002
      velocities[index * 3 + 1] = (Math.random() - 0.5) * 0.002
      velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
  
    useFrame(() => {
      const particles = particlesRef.current
      const positions = particles.geometry.attributes.position.array
      const velocities = velocitiesRef.current
  
      for (let i = 0; i < particleCountRef.current; i++) {
        let totalForce = [0, 0, 0]
  
        for (let j = 0; j < ATTRACTOR_COUNT; j++) {
          const dx = attractorPositions[j * 3] - positions[i * 3]
          const dy = attractorPositions[j * 3 + 1] - positions[i * 3 + 1]
          const dz = attractorPositions[j * 3 + 2] - positions[i * 3 + 2]
          const distanceSquared = dx * dx + dy * dy + dz * dz
          const force = 0.0000025 / distanceSquared // Avoid sqrt for performance
  
          totalForce[0] += dx * force
          totalForce[1] += dy * force
          totalForce[2] += dz * force
        }
  
        velocities[i * 3] += totalForce[0]
        velocities[i * 3 + 1] += totalForce[1]
        velocities[i * 3 + 2] += totalForce[2]
  
        // Apply velocity with damping
        const damping = 0.97 // Slightly reduced damping for faster movement
        positions[i * 3] += velocities[i * 3] * damping
        positions[i * 3 + 1] += velocities[i * 3 + 1] * damping
        positions[i * 3 + 2] += velocities[i * 3 + 2] * damping
  
        // Boundary check and reinitialization
        const bound = 6
        if (Math.abs(positions[i * 3]) > bound || 
            Math.abs(positions[i * 3 + 1]) > bound || 
            Math.abs(positions[i * 3 + 2]) > bound) {
          initializeParticle(positions, velocities, i)
        }
      }
  
      // Add new particles periodically
      if (Math.random() < 0.1 && particleCountRef.current < particleCount * 1.5) {
        const index = particleCountRef.current * 3
        initializeParticle(particlePool, velocities, particleCountRef.current)
        positions[index] = particlePool[index]
        positions[index + 1] = particlePool[index + 1]
        positions[index + 2] = particlePool[index + 2]
        particleCountRef.current++
      }
  
      particles.geometry.attributes.position.needsUpdate = true
    })
  
    return (
      <>
        <points ref={particlesRef}>
          <bufferGeometry />
          <pointsMaterial 
            size={0.03} 
            transparent 
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            vertexColors
          />
        </points>
        <points ref={attractorsRef}>
          <bufferGeometry />
          <pointsMaterial size={0.02} color="#ffa575" transparent opacity={0.1} />
        </points>
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </>
    )
}

const HeartAnimation = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles />
      </Canvas>
    </div>
  )
}

export default HeartAnimation