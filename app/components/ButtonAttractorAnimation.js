import React, { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { detect } from 'detect-browser'

const browser = detect()
const isMobile = browser && (browser.os === 'iOS' || browser.os === 'Android OS')

const BASE_PARTICLE_COUNT = isMobile ? 3000 : 6000
const ATTRACTOR_COUNT = 10

function Particles({ buttonPosition }) {
  const particlesRef = useRef()
  const attractorsRef = useRef()
  const velocitiesRef = useRef()
  const [particleCount, setParticleCount] = useState(BASE_PARTICLE_COUNT)
  const particleCountRef = useRef(particleCount)

  const { gl, camera } = useThree()

  useEffect(() => {
    const checkGPUCapabilities = () => {
      try {
        const extension = gl.getExtension('WEBGL_debug_renderer_info')
        if (extension) {
          const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
          if (renderer.includes('Apple') || renderer.includes('Mali') || renderer.includes('Adreno')) {
            setParticleCount(BASE_PARTICLE_COUNT / 2)
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
      const angle = (i / ATTRACTOR_COUNT) * Math.PI * 2
      const radius = 1.5
      positions[i * 3] = Math.cos(angle) * radius + buttonPosition.x
      positions[i * 3 + 1] = Math.sin(angle) * radius + buttonPosition.y
      positions[i * 3 + 2] = 0
    }
    return positions
  }, [buttonPosition])

  const particlePool = useMemo(() => new Float32Array(BASE_PARTICLE_COUNT * 3 * 1.5), [])

  useEffect(() => {
    const particles = particlesRef.current
    const attractors = attractorsRef.current

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    velocitiesRef.current = new Float32Array(particleCount * 3)

    const color = new THREE.Color("#A2A3BC")

    for (let i = 0; i < particleCount; i++) {
      initializeParticle(positions, velocitiesRef.current, i)
      color.toArray(colors, i * 3)
    }

    particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    attractors.geometry.setAttribute('position', new THREE.BufferAttribute(attractorPositions, 3))
  }, [attractorPositions, particleCount])

  const initializeParticle = (positions, velocities, index) => {
    const radius = 3 + Math.random() * 2
    const angle = Math.random() * Math.PI * 2
    positions[index * 3] = Math.cos(angle) * radius + buttonPosition.x
    positions[index * 3 + 1] = Math.sin(angle) * radius + buttonPosition.y
    positions[index * 3 + 2] = (Math.random() - 0.5) * 2
    velocities[index * 3] = (Math.random() - 0.5) * 0.01
    velocities[index * 3 + 1] = (Math.random() - 0.5) * 0.01
    velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.01
  }

  useFrame(() => {
    const particles = particlesRef.current
    const positions = particles.geometry.attributes.position.array
    const velocities = velocitiesRef.current

    for (let i = 0; i < particleCountRef.current; i++) {
      let totalForce = [0, 0, 0]

      // Attraction to button
      const dx = buttonPosition.x - positions[i * 3]
      const dy = buttonPosition.y - positions[i * 3 + 1]
      const dz = buttonPosition.z - positions[i * 3 + 2]
      const distanceSquared = dx * dx + dy * dy + dz * dz
      const buttonForce = 0.00005 / (distanceSquared + 0.1)
      totalForce[0] += dx * buttonForce
      totalForce[1] += dy * buttonForce
      totalForce[2] += dz * buttonForce

      // Attraction to other attractors
      for (let j = 0; j < ATTRACTOR_COUNT; j++) {
        const dx = attractorPositions[j * 3] - positions[i * 3]
        const dy = attractorPositions[j * 3 + 1] - positions[i * 3 + 1]
        const dz = attractorPositions[j * 3 + 2] - positions[i * 3 + 2]
        const distanceSquared = dx * dx + dy * dy + dz * dz
        const force = 0.000001 / (distanceSquared + 0.1)

        totalForce[0] += dx * force
        totalForce[1] += dy * force
        totalForce[2] += dz * force
      }

      velocities[i * 3] += totalForce[0]
      velocities[i * 3 + 1] += totalForce[1]
      velocities[i * 3 + 2] += totalForce[2]

      const damping = 0.95
      positions[i * 3] += velocities[i * 3] * damping
      positions[i * 3 + 1] += velocities[i * 3 + 1] * damping
      positions[i * 3 + 2] += velocities[i * 3 + 2] * damping

      const distanceToButton = Math.sqrt(
        Math.pow(positions[i * 3] - buttonPosition.x, 2) +
        Math.pow(positions[i * 3 + 1] - buttonPosition.y, 2) +
        Math.pow(positions[i * 3 + 2] - buttonPosition.z, 2)
      )

      if (distanceToButton > 5) {
        initializeParticle(positions, velocities, i)
      }
    }

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
          size={0.05} 
          transparent 
          opacity={0.6}
          blending={THREE.NormalBlending} // Change to NormalBlending
          vertexColors
        />
      </points>
      <points ref={attractorsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.02} color="#ffa575" transparent opacity={0.1} />
      </points>
      
    </>
  )
}

const ButtonAttractorAnimation = ({ buttonPosition }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles buttonPosition={buttonPosition} />
      </Canvas>
    </div>
  )
}

export default ButtonAttractorAnimation