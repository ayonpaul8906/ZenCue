// src/pages/FocusEnhancers.tsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { extractImportantWords } from '../../hooks/importantWords'
import { FaPlay, FaStop } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FocusEnhancers = () => {
  const [text, setText] = useState('')
  const navigate = useNavigate();
  const [highlightedWords, setHighlightedWords] = useState<string[]>([])
  const [isReading, setIsReading] = useState(false)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)

  const speakText = () => {
    if (!text) return
    utterance.current = new SpeechSynthesisUtterance(text)
    utterance.current.rate = 0.9
    speechSynthesis.speak(utterance.current)
    setIsReading(true)
    utterance.current.onend = () => setIsReading(false)
  }

  const stopSpeech = () => {
    speechSynthesis.cancel()
    setIsReading(false)
  }

  const handleHighlight = () => {
    const words = extractImportantWords(text)
    setHighlightedWords(words)
  }

  const renderHighlightedText = () => {
    
    return text.split(' ').map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '')
      const isImportant = highlightedWords.includes(cleanWord)
      return (
        <span
          key={index}
          className={isImportant ? 'bg-yellow-300 px-1 py-0.5 rounded-md font-semibold' : ''}
        >
          {word + ' '}
        </span>
      )
    })
  }

  return (
    
    <div className="min-h-screen px-6 py-10 bg-white text-black">
        <motion.button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </motion.button>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-left">🧘 Focus Enhancers</h1>
      </div>

      <textarea
        rows={6}
        placeholder="Paste or write text to analyze..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-xl p-4 text-lg mb-6 resize-none bg-white text-black transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <div className="flex gap-4 mb-8">
        <button
          onClick={speakText}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
        >
          <FaPlay className="inline mr-2" /> Play
        </button>
        <button
          onClick={stopSpeech}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
        >
          <FaStop className="inline mr-2" /> Stop
        </button>
        <button
          onClick={handleHighlight}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
        >
          🎯 Highlight
        </button>
      </div>

      <motion.div
        className="text-lg leading-relaxed p-6 rounded-xl bg-gray-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderHighlightedText()}
      </motion.div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">⏱ Pomodoro Focus Timer</h2>
        <div className="flex justify-center items-center">
          <div className="relative w-full sm:w-1/2">
            {/* Updated iframe without any overlay */}
            <iframe
              className="rounded-lg shadow-lg border w-full h-56 sm:h-64"
              src="https://pomofocus.io/"
              title="Pomodoro Timer"
              allow="autoplay; fullscreen"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FocusEnhancers
