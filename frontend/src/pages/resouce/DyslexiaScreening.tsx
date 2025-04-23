import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const screenings = [
  {
    title: "Lexercise Free Dyslexia Test",
    description:
      "A clinically backed free online screening for dyslexia. Perfect for both children and adults.",
    link: "https://www.lexercise.com/tests/dyslexia-test?utm_source=chatgpt.com",
  },
  {
    title: "IDA Adult Reading History Questionnaire",
    description:
      "A quick screener developed by the International Dyslexia Association for adults.",
    link: "https://dyslexiaida.org/screening-for-dyslexia/dyslexia-screener-for-adults/?utm_source=chatgpt.com",
  },
  {
    title: "Davis Dyslexia Screening Test",
    description: "Online assessment tools for recognizing dyslexia signs in learners.",
    link: "https://www.testdyslexia.com/?utm_source=chatgpt.com",
  },
];


export default function DyslexiaScreening() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-12 sm:px-12 md:px-24">
      
      <motion.button
          onClick={() => navigate("/resources")}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold mb-8"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={20} />
          Back to Resources
        </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          🧠 Dyslexia Screening Tools
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Early screening is essential. Explore professional tools to better
          understand dyslexia and discover the support you need.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {screenings.map((tool, index) => (
          <motion.a
            key={index}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-300 flex items-center justify-between">
              {tool.title}
              <FaExternalLinkAlt className="ml-2 text-sm text-purple-500" />
            </h2>
            <p className="text-gray-500 mt-3">{tool.description}</p>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-gray-600">
          Disclaimer: These tools are for informational purposes and not a
          diagnosis.
        </p>
      </motion.div>
    </div>
  );
}