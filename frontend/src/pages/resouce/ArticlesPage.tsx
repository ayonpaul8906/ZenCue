import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const articles = [
  {
    title: "Understanding ADHD: A Comprehensive Guide",
    image: "/ADHD.png",
    link: "https://www.brightpinepsychology.com/understanding-adhd-a-comprehensive-guide-to-its-types-and-characteristics/",
    description:
      "An in-depth look at ADHD, its symptoms, and strategies to manage it in everyday life.",
  },
  {
    title: "Dyslexia: Signs, Symptoms, and Solutions",
    image: "/dyslexia.jpg",
    link: "https://my.clevelandclinic.org/health/diseases/6005-dyslexia",
    description:
      "Learn about dyslexia, its challenges, and how individuals can thrive with support and interventions.",
  },
  {
    title: "Neurodivergence: A New Perspective on the Brain",
    image: "/Neurodivergence.webp",
    link: "https://blog.siemens.com/en/2024/10/neurodiversity-a-new-perspective-on-the-human-brain/",
    description:
      "Discover the concept of neurodivergence and how it challenges traditional views of cognitive diversity.",
  },
  {
    title: "Support Systems for Neurodivergent Individuals",
    image: "/SupportSystem.png",
    link: "https://www.researchgate.net/publication/348095617_Global_Neurodiverse_Support_Systems_Primary_Research_Findings_on_Key_Challenges_and_Optimized_Solutions_in_Mumbai_India",
    description:
      "How to create support systems for individuals with neurodivergent traits in both educational and workplace environments.",
  },
];

export default function ArticlesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-12 font-sans">
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

      <div className="text-center mb-10">
        <motion.h1
          className="text-4xl font-extrabold text-purple-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Articles on Neurodivergence
        </motion.h1>
        <p className="text-lg text-gray-400">
          Explore insightful articles to learn more about ADHD, dyslexia, and
          neurodivergence.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <motion.h3
                className="text-xl font-bold text-purple-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {article.title}
              </motion.h3>
              <p className="text-gray-500 mb-4">{article.description}</p>
              <motion.a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 font-semibold hover:text-purple-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Read More ➡
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
