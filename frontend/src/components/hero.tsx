import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export function Hero() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  // Helper to initialize Vanta
  const initializeVanta = () => {
    import("vanta/dist/vanta.halo.min").then((VANTA) => {
      if (vantaRef.current && !vantaEffect) {
        const effect = VANTA.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          baseColor: 0x8e44ad, // glowing purple
          backgroundColor: 0x0a0a0a,
          xOffset: 0.25,
          yOffset: 0.25,
        })
        setVantaEffect(effect)
      }
    })
  }

  useEffect(() => {
    initializeVanta()
    // Listen for WebGL context loss/restoration
    const canvas = vantaRef.current?.querySelector("canvas")
    const handleContextLost = () => {
      vantaEffect?.destroy?.()
      setVantaEffect(null)
    }
    const handleContextRestored = () => {
      initializeVanta()
    }
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost)
      canvas.addEventListener("webglcontextrestored", handleContextRestored)
    }
    return () => {
      vantaEffect?.destroy?.()
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost)
        canvas.removeEventListener("webglcontextrestored", handleContextRestored)
      }
    }
    // eslint-disable-next-line
  }, []) // Only run once on mount/unmount

  return (
    <div
      ref={vantaRef}
      className="relative min-h-screen flex items-center justify-center text-white font-sans"
      style={{ backgroundColor: "#0a0a0a" }} // fallback background
    >
      <div className="relative z-10 max-w-5xl px-6 py-24 sm:py-32 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your smart & personalized AI companion
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Empowering neurodivergent minds with smart, adaptive assistance -
          helping you focus, undertsand and navigate with ease
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/profile">
            <Button size="lg" className="rounded-full">
              Your's Space
            </Button>
          </Link>
          <Link to="/resources">
            <Button size="lg" variant="outline" className="rounded-full text-black">
              Test Yourself
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}