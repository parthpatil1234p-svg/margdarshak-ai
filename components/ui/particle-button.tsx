"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onSuccess?: () => void
  successDuration?: number
  className?: string
  particleCount?: number
  variant?: "default" | "glow" | "outline"
}

function SuccessParticles({
  buttonRef,
  particleCount = 12,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>
  particleCount?: number
}) {
  const rect = buttonRef.current?.getBoundingClientRect()
  if (!rect) return null

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const colors = ["#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#f43f5e", "#ffffff"]

  return (
    <AnimatePresence>
      {[...Array(particleCount)].map((_, i) => {
        const randomColor = colors[i % colors.length]
        const angle = (i / particleCount) * 2 * Math.PI
        const velocity = Math.random() * 60 + 30
        const destX = Math.cos(angle) * velocity
        const destY = Math.sin(angle) * velocity - 20

        return (
          <motion.div
            key={i}
            className="fixed pointer-events-none z-50 rounded-full"
            style={{
              left: centerX,
              top: centerY,
              width: Math.random() * 4 + 3,
              height: Math.random() * 4 + 3,
              backgroundColor: randomColor,
              boxShadow: `0 0 10px ${randomColor}`,
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1.4, 0],
              x: destX,
              y: destY,
              opacity: [1, 0.9, 0],
            }}
            transition={{
              duration: 0.7,
              delay: (i % 3) * 0.05,
              ease: "easeOut",
            }}
          />
        )
      })}
    </AnimatePresence>
  )
}

export function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className = "",
  particleCount = 14,
  variant = "glow",
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowParticles(true)
    if (onClick) onClick(e)
    if (onSuccess) onSuccess()

    setTimeout(() => {
      setShowParticles(false)
    }, successDuration)
  }

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-95 select-none overflow-hidden cursor-pointer"
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
    glow: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105 border border-white/20",
    outline: "border border-border/80 bg-background/80 text-foreground hover:bg-accent backdrop-blur-sm",
  }

  return (
    <>
      {showParticles && (
        <SuccessParticles buttonRef={buttonRef} particleCount={particleCount} />
      )}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`${baseStyles} ${variantStyles[variant]} ${
          showParticles ? "scale-95 brightness-110" : ""
        } ${className}`}
        {...props}
      >
        <span>{children}</span>
        <Sparkles className="h-4 w-4 animate-spin-slow text-amber-300" />
      </button>
    </>
  )
}
