import TextToSpeech from '../special-features/text-to-speech';
import Magnifier from '../special-features/magnifier';
import EReader from '../special-features/E-reader';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ReadingAidsPage = () => {
const navigate = useNavigate();
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
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

        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-purple-300">Reading Aids for Neurodivergent Users</h1>
          <p className="mt-4 text-lg text-gray-400">
            Discover tools and resources to help make reading easier and more
            accessible.
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <TextToSpeech />
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <Magnifier />
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <EReader />
        </div>
      </div>
    </div>
  );
};

export default ReadingAidsPage;