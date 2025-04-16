'use client'

import { useState } from 'react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { PasswordInput } from '../components/ui/PasswordInput'
import { motion } from 'framer-motion'
import { Link } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Login:', email, password)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4">

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-base font-medium">Back</span>
      </Link>

      <motion.div
        className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl font-bold text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Log In
        </motion.h2>

        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {/* Email Field */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <label className="text-lg text-zinc-100 font-semibold mb-2 block">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="text-base py-5 px-5 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all placeholder:text-zinc-400"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <label className="text-lg text-zinc-100 font-semibold mb-2 block">Password</label>
            <PasswordInput
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-base py-5 px-5 rounded-xl "
            />
          </motion.div>

          {/* Login Button */}
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
            <Button
              onClick={handleLogin}
              className="w-full mt-2 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 py-4 rounded-xl"
            >
              Log In
            </Button>
          </motion.div>
        </motion.div>

        {/* Signup Link */}
        <motion.p
          className="text-base text-center text-zinc-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don’t have an account?
          <Link to="/signup" className="text-blue-400 hover:underline ml-1 font-medium">Sign up</Link>
        </motion.p>
      </motion.div>
    </main>
  )
}
