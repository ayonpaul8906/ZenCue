'use client'

import { useState } from 'react'
import { Input } from './input'
import { motion, AnimatePresence } from 'framer-motion'

export function PasswordInput({ value, onChange, placeholder }: any) {
  const [showPassword, setShowPassword] = useState(false)

  // Use images from the public directory correctly
  const boyImage = showPassword ? '/boy-open.png' : '/boy-closed.png'

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-16" // increase padding for larger image space
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={boyImage}
            src={boyImage}
            alt="Toggle password visibility"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="w-10 h-10 object-contain filter brightness-90 contrast-125 drop-shadow-md"
          />
        </AnimatePresence>
      </button>
    </div>
  )
}
