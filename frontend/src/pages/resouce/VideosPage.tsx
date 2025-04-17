import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const videos = [
  {
    title: "Understanding ADHD",
    videoUrl: "https://www.youtube.com/embed/-merjqmlYo8", 
    description:
      "An informative video that explains ADHD, its symptoms, and how it affects individuals.",
  },
  {
    title: "Dyslexia: Myths and Facts",
    videoUrl: "https://www.youtube.com/embed/HaULXRX9o1E", 
    description:
      "This video breaks down the common myths about dyslexia and presents the true facts.",
  },
  {
    title: "Neurodivergence: The Future of Education",
    videoUrl: "https://www.youtube.com/embed/ALJ3CFRRZpo", // Replace with actual YouTube video ID
    description:
      "A look at how neurodivergence is being understood in educational systems around the world.",
  },
  {
    title: "Support for Neurodivergent Individuals",
    videoUrl: "https://www.youtube.com/embed/FPivh_aKJms", // Replace with actual YouTube video ID
    description:
      "This video discusses the importance of support networks for neurodivergent individuals in both personal and professional environments.",
  },
];

export default function VideosPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] to-[#f5ebff] p-6 md:p-12 text-gray-800 font-sans">
      <motion.button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </motion.button>

      <div className="text-center mb-10">
        <motion.h1
          className="text-4xl font-extrabold text-purple-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          🎥 Insightful Videos on Neurodivergence
        </motion.h1>
        <p className="text-lg text-gray-500">
          Explore educational and insightful videos about ADHD, dyslexia, and neurodivergence.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <div className="relative w-full h-56 overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={video.videoUrl}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <motion.h3
                className="text-xl font-bold text-purple-700 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {video.title}
              </motion.h3>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <motion.a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 font-semibold hover:text-purple-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Watch Now ➡
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
