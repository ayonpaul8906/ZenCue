import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const forums = [
  {
    title: "ADHD Adults Support Group",
    description: "Join discussions with other adults navigating life with ADHD. Share strategies, wins, and challenges.",
    tags: ["ADHD", "Adults", "Productivity"],
  },
  {
    title: "Dyslexia Learners Community",
    description: "A safe space to share resources, stories, and tools for people with dyslexia of all ages.",
    tags: ["Dyslexia", "Education", "Youth"],
  },
  {
    title: "Neurodivergent Techies Forum",
    description: "Tech-minded neurodivergent individuals talk coding, accessibility, jobs, and more.",
    tags: ["Autism", "ADHD", "Tech"],
  },
  {
    title: "Parents of Neurodivergent Kids",
    description: "Support and resources for parents raising neurodivergent children.",
    tags: ["Parents", "Kids", "Autism", "Dyslexia"],
  },
];

const OnlineForums = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(search.toLowerCase()) ||
    forum.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-900 text-gray-100 transition">
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

      <motion.h1
        className="text-4xl font-bold mb-4 text-center sm:text-left text-purple-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌐 Online Forums
      </motion.h1>
      <p className="mb-6 text-lg max-w-2xl text-gray-400">
        Explore online communities built for ADHD, dyslexia, autism, and other neurodivergent experiences.
      </p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search forums by name or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-gray-800 text-gray-100 border-gray-700"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForums.length > 0 ? (
          filteredForums.map((forum, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl shadow-lg bg-gray-800 hover:shadow-xl border border-gray-700 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-purple-300">{forum.title}</h3>
              <p className="text-sm mb-4 text-gray-500">{forum.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {forum.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-3 py-1 rounded-full bg-purple-800 text-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium text-sm"
              >
                Join Forum
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No forums found.</p>
        )}
      </div>
    </div>
  );
};

export default OnlineForums;