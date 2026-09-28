'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { configurator, choiceOf, type Selection } from '@/data/configurator'
import { KEYS, LAYOUT_DEPTH, LAYOUT_WIDTH } from '@/scenes/services/keyboard-layout'

// The live demo keyboard (spec 6.02), built from rounded boxes so there is no model file to load.
// Lazy-loaded with three.js into the Services chunk only.

const CASE_W = LAYOUT_WIDTH + 1.2
const CASE_D = LAYOUT_DEPTH + 1.2
const CAP_Y = 1.12
const LIFTED = KEYS.findIndex((k) => k.y === 2 && k.x === 7.75)
const FIT_WIDTH = CASE_W + 1.6

const keyX = (x: number, w: number) => x + w / 2 - LAYOUT_WIDTH / 2
const keyZ = (y: number) => y + 0.5 - LAYOUT_DEPTH / 2

function Environment() {
  const gl = useThree((s) => s.gl)
  // A procedural studio room for reflections: no HDR file to download.
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const texture = pmrem.fromScene(room, 0.04).texture
    room.dispose()
    pmrem.dispose()
    return texture
  }, [gl])
  useEffect(() => () => env.dispose(), [env])
  return <primitive object={env} attach="environment" />
}

// Keeps the whole board in frame at any canvas shape.
function Fit() {
  const { camera, size } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const aspect = size.width / size.height
    const half = THREE.MathUtils.degToRad(cam.fov / 2)
    const byWidth = FIT_WIDTH / 2 / (Math.tan(half) * aspect)
    const byHeight = 5.2 / Math.tan(half)
    const dist = Math.max(byWidth, byHeight)
    cam.position.set(0, dist * 0.62, dist * 0.78)
    cam.lookAt(0, -0.3, 0)
    cam.updateProjectionMatrix()
  }, [camera, size])
  return null
}

// A soft dark blob under the board instead of real shadows.
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
    g.addColorStop(0, 'rgba(0,0,0,0.65)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])
}

function Board({ selection }: { selection: Selection }) {
  const group = useRef<THREE.Group>(null)
  const caps = useRef<Array<THREE.Mesh | null>>([])
  const pressedAt = useRef(-10)
  const shadow = useShadowTexture()

  const geometries = useMemo(() => {
    const byWidth = new Map<number, THREE.BufferGeometry>()
    for (const k of KEYS) if (!byWidth.has(k.w)) byWidth.set(k.w, new RoundedBoxGeometry(k.w - 0.12, 0.52, 0.88, 3, 0.12))
    return {
      byWidth,
      body: new RoundedBoxGeometry(CASE_W, 1.1, CASE_D, 5, 0.38),
      housing: new THREE.BoxGeometry(0.64, 0.3, 0.64),
      stemA: new THREE.BoxGeometry(0.34, 0.16, 0.09),
      stemB: new THREE.BoxGeometry(0.09, 0.16, 0.34),
    }
  }, [])

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.32 }),
      plate: new THREE.MeshStandardMaterial({ color: '#0B0C0A', roughness: 0.9 }),
      cap: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
      accent: new THREE.MeshStandardMaterial({ color: configurator.accent, roughness: 0.5 }),
      housing: new THREE.MeshStandardMaterial({ color: '#15160F', roughness: 0.6 }),
      stem: new THREE.MeshStandardMaterial({ roughness: 0.4 }),
    }),
    [],
  )

  useEffect(
    () => () => {
      geometries.byWidth.forEach((g) => g.dispose())
      Object.values(geometries).forEach((g) => g instanceof THREE.BufferGeometry && g.dispose())
      Object.values(materials).forEach((m) => m.dispose())
      shadow.dispose()
    },
    [geometries, materials, shadow],
  )

  const targets = useMemo(
    () => ({
      body: new THREE.Color(choiceOf('case', selection).color),
      cap: new THREE.Color(choiceOf('keycaps', selection).color),
      stem: new THREE.Color(choiceOf('switches', selection).color),
    }),
    [selection],
  )

  // The first frame takes the colours as they are; later changes blend in.
  const primed = useRef(false)

  // A new switch type runs a press wave across the board, left to right.
  const switchId = selection.switches
  const firstSwitch = useRef(switchId)
  useEffect(() => {
    if (switchId !== firstSwitch.current) pressedAt.current = performance.now() / 1000
    firstSwitch.current = switchId
  }, [switchId])

  useFrame((state, delta) => {
    const k = primed.current ? 1 - Math.exp(-delta * 7) : 1
    primed.current = true
    materials.body.color.lerp(targets.body, k)
    materials.cap.color.lerp(targets.cap, k)
    materials.stem.color.lerp(targets.stem, k)

    const g = group.current
    if (g) {
      g.rotation.y += (-0.12 + state.pointer.x * 0.22 - g.rotation.y) * k * 0.5
      g.rotation.x += (0.08 - state.pointer.y * 0.1 - g.rotation.x) * k * 0.5
    }

    const now = performance.now() / 1000
    const t = state.clock.elapsedTime
    caps.current.forEach((mesh, i) => {
      if (!mesh) return
      const key = KEYS[i]
      if (i === LIFTED) {
        mesh.position.y = CAP_Y + 1.9 + Math.sin(t * 1.6) * 0.14
        mesh.position.z = keyZ(key.y) + 0.9
        mesh.rotation.x = -0.5
        mesh.rotation.z = Math.sin(t * 1.1) * 0.12
        return
      }
      const local = now - pressedAt.current - (key.x + key.w / 2) * 0.035
      const dip = local > 0 && local < 0.22 ? Math.sin((local / 0.22) * Math.PI) * 0.26 : 0
      mesh.position.y = CAP_Y - dip
    })
  })

  return (
    <group ref={group}>
      <mesh geometry={geometries.body} material={materials.body} position={[0, 0, 0]} />
      <mesh material={materials.plate} position={[0, 0.56, 0]}>
        <boxGeometry args={[LAYOUT_WIDTH + 0.1, 0.04, LAYOUT_DEPTH + 0.1]} />
      </mesh>
      {KEYS.map((key, i) => {
        const x = keyX(key.x, key.w)
        const z = keyZ(key.y)
        return (
          <group key={i}>
            <mesh geometry={geometries.housing} material={materials.housing} position={[x, 0.72, z]} />
            <mesh geometry={geometries.stemA} material={materials.stem} position={[x, 0.93, z]} />
            <mesh geometry={geometries.stemB} material={materials.stem} position={[x, 0.93, z]} />
            <mesh
              ref={(m) => {
                caps.current[i] = m
              }}
              geometry={geometries.byWidth.get(key.w)}
              material={key.accent ? materials.accent : materials.cap}
              position={[x, CAP_Y, z]}
            />
          </group>
        )
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.56, 0.3]}>
        <planeGeometry args={[CASE_W * 1.5, CASE_D * 2.4]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function Keyboard3D({ selection, running }: { selection: Selection; running: boolean }) {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      frameloop={running ? 'always' : 'never'}
      camera={{ fov: 28, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Environment />
      <Fit />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-6, 12, 8]} intensity={0.9} />
      <directionalLight position={[8, 4, -6]} intensity={0.6} color="#D4FF3F" />
      <Board selection={selection} />
    </Canvas>
  )
}
