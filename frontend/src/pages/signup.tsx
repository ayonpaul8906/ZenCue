'use client';

import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { PasswordInput } from '../components/ui/PasswordInput';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/AuthContext';
import { toast } from "react-hot-toast"; 

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signup success:', user);
      login(user); // Update the AuthContext with the signed-up user
  
      // Play success sound
      const audio = new Audio("/success-sound.mp3"); // Replace with your success sound file
      audio.play();
  
      // Show success toast
      toast.success("Signup successful!");
  
      navigate('/profile'); // Redirect to the profile page or any protected route
    } catch (error: any) {
      console.error('Signup error:', error.message);
      setError(error.message);
    }
  };

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

      {/* Card */}
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
          Create an Account
        </motion.h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {/* Email Field */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <label className="text-lg text-zinc-100 font-semibold mb-2 block">Email</label>
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
              placeholder="Create a strong password"
              className="text-base py-5 px-5 rounded-xl"
            />
          </motion.div>

          {/* Signup Button */}
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
            <Button
              onClick={handleSignup}
              className="w-full mt-2 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-300 py-4 rounded-xl"
            >
              Sign Up
            </Button>
          </motion.div>
        </motion.div>

        {/* Login Redirect */}
        <motion.p
          className="text-base text-center text-zinc-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Already have an account?
          <Link to="/login" className="text-blue-400 hover:underline ml-1 font-medium">
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
