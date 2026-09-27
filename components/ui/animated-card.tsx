"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: "indigo" | "cyan" | "emerald" | "amber" | "rose"
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  badgeText?: string
}

export function AnimatedCard({
  children,
  className = "",
  glowColor = "indigo",
  title,
  subtitle,
  icon,
  badgeText,
}: AnimatedCardProps) {
  const glowStyles = {
    indigo: "hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]",
    emerald: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]",
    amber: "hover:border-amber-500/50 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]",
    rose: "hover:border-rose-500/50 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.4)]",
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 ${glowStyles[glowColor]} ${className}`}
    >
      {/* Dynamic Animated Gradient Top Highlight */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header if provided */}
      {(title || icon || badgeText) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary shadow-inner">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>
          {badgeText && (
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
              {badgeText}
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
