import { motion } from "framer-motion";
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'

const About: React.FC = () => {
  return (
    <div>
      <Navigation />

      <div className="min-h-screen bg-gray-900 text-white">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500">
            About <span className="text-purple-400">ZenCue</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-3xl mx-auto">
            Designed with empathy and powered by AI, ZenCue is your calm digital companion that simplifies complex content, breaks down overwhelming tasks, and helps you stay focused in a noisy online world. Whether you're navigating the web, studying, or working, ZenCue gently guides you every step of the way—on your terms.
          </p>
        </motion.section>

        {/* Our Mission & Vision */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <h2 className="text-2xl font-bold text-pink-400">Our Mission</h2>
              <p className="text-gray-300 mt-2">
                To empower neurodivergent individuals by making digital experiences simpler, smarter, and more supportive. We build intuitive tools that reduce overwhelm and enhance everyday focus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <h2 className="text-2xl font-bold text-pink-400">Our Vision</h2>
              <p className="text-gray-300 mt-2">
                To create a digital world where every mind—neurodivergent or not—can thrive with clarity and confidence. We aim to set the standard for accessible, empowering AI support.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-16 bg-gray-800">
          <h2 className="text-center text-3xl font-bold text-pink-500 mb-8">
            Meet Our Team
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member 1 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
            >
              <img
                src="../../../images/ayon.jpg"
                alt="Team Member"
                className="rounded-full mx-auto mb-4 border-4 border-pink-500"
              />
              <h3 className="text-lg font-bold">Ayon Paul</h3>
              <p className="text-gray-400">Frontend Developer</p>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
            >
              <img
                src="../../../images/arnab.jpg"
                alt="Team Member"
                className="rounded-full mx-auto mb-4 border-4 border-purple-500"
              />
              <h3 className="text-lg font-bold">Arnab Ghosh</h3>
              <p className="text-gray-400">FullStack developer</p>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
            >
              <img
                src="../../../images/arnab.jpg"
                alt="Team Member"
                className="rounded-full mx-auto mb-4 border-4 border-purple-500"
              />
              <h3 className="text-lg font-bold">Soumi Das</h3>
              <p className="text-gray-400">UI/UX Designer</p>
            </motion.div>
            {/* Team Member 4 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
            >
              <img
                src="../../../images/arnab.jpg"
                alt="Team Member"
                className="rounded-full mx-auto mb-4 border-4 border-purple-500"
              />
              <h3 className="text-lg font-bold">Sudipta Maity</h3>
              <p className="text-gray-400">Project Manager</p>
            </motion.div>
            {/* Add additional team members here */}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default About;