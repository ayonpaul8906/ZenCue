import TextToSpeech from '../special-features/text-to-speech';
import Magnifier from '../special-features/magnifier';
import EReader from '../special-features/E-reader';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ReadingAidsPage = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto p-6">
            <motion.button
                onClick={() => navigate("/resources")}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-8"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                <ArrowLeft size={20} />
                Back to Resources
            </motion.button>

            <header className="text-center mb-12">
                <h1 className="text-4xl font-semibold text-purple-800">Reading Aids for Neurodivergent Users</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Discover tools and resources to help make reading easier and more accessible.
                </p>
            </header>

            <TextToSpeech />
            <Magnifier />
            <EReader />
        </div>
    );
};

export default ReadingAidsPage;
