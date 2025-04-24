// import { motion } from "framer-motion";
// import { Button } from "../components/ui/button";
// import { Card } from "../components/ui/card";
// import { Navigation } from '../components/navigation'
// import { Footer } from '../components/footer'
// import { Link } from "react-router-dom"

// const NeurodivergentResourcesPage = () => {
//     return (
//         <div><Navigation />
//             <div className="max-w-7xl mx-auto px-4 py-12">
//                 {/* Hero Section */}
//                 <section className="text-center mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h1 className="text-4xl font-extrabold text-purple-900 mb-4">
//                             Empowering Neurodivergent Minds
//                         </h1>
//                     </motion.div>
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5, duration: 1 }}>
//                         <p className="text-lg text-gray-600">
//                             Discover resources, tools, and support tailored for ADHD, dyslexia,
//                             and neurodivergent individuals.
//                         </p>
//                     </motion.div>
//                 </section>

//                 {/* Self-Assessment Tools */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-900 mb-4">
//                             Understand Your Neurodivergent Traits
//                         </h2>
//                     </motion.div>
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.3, duration: 1 }}>
//                         <p className="text-lg text-gray-600 mb-6">
//                             It's important to understand your neurodivergent traits to better
//                             navigate daily life. Here are some tools you can use:
//                         </p>
//                     </motion.div>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">ADHD Self-Assessment</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Take this self-assessment to understand more about ADHD traits.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                                 <Link to="https://www.clinical-partners.co.uk/for-adults/adult-adhd-add/test-for-adhd" target="_blank"> Take Test </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Dyslexia Screening</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 A quick screening tool to identify potential dyslexia traits.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/screening" > Start Screening </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Neurodivergent Quiz</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Identify neurodivergent traits through this quiz.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/quiz" > Take Quiz </Link>
//                             </Button>
//                         </Card>
//                     </div>
//                 </section>

//                 {/* Educational Resources */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-900 mb-4">
//                             Learn More About Neurodivergence
//                         </h2>
//                     </motion.div>
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Articles</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Curated articles to help you understand neurodivergence.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                                 <Link to="/articles" > Read Articles </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Videos</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Watch insightful videos about ADHD, dyslexia, and neurodivergence.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                                 <Link to="/videos" > Watch Videos </Link>
//                             </Button>
//                         </Card>
//                     </div>
//                 </section>

//                 {/* Practical Tools and Strategies */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-900 mb-4">
//                             Tools to Support Your Journey
//                         </h2>
//                     </motion.div>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Task Management Apps</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Recommended apps to help you stay organized and manage tasks.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="https://play.google.com/store/search?q=Task%20Management%20Apps&c=apps&hl=en_IN" > Explore Apps </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Reading Aids</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Tools designed to assist with reading difficulties.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/reading-aids" > View Tools </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Focus Enhancers</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Enhance focus with these proven tools.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/focus-enhancers" > Discover Tools </Link>
//                             </Button>
//                         </Card>
//                     </div>
//                 </section>

//                 {/* Community and Support */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-900 mb-4">
//                             Join the Neurodivergent Community
//                         </h2>
//                     </motion.div>
//                     <p className="text-lg text-gray-600 mb-6">
//                         Connect with others for support and shared experiences. Here are some
//                         great ways to get involved:
//                     </p>
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Online Forums</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Join online forums for discussions and support.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/online-forums" > Join Forums </Link>
//                             </Button>
//                         </Card>
//                         <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
//                             <h3 className="font-semibold text-xl text-purple-700 mb-2">Support Groups</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Find virtual or local support groups to connect with others.
//                             </p>
//                             <Button variant="outline" className="w-full">
//                             <Link to="/support-groups" > Find Support </Link> 
//                             </Button>
//                         </Card>
//                     </div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default NeurodivergentResourcesPage;





//Gemini

import {useEffect, useState, useRef} from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button"; // Assuming this Button can take classNames
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"; // Assuming Card structure like Shadcn UI
import { Navigation } from '../components/navigation'; // Assuming Navigation adapts or is styled separately
import { Footer } from '../components/footer'; // Assuming Footer adapts or is styled separately
import { Link } from "react-router-dom";
import { ArrowRight } from 'lucide-react'; // Example icon import
import { useAuth } from '../hooks/AuthContext';
import { logActivity, ActivityTypes } from '../lib/activity'; 
import { getUserUsage, getPlanLimits } from '../lib/usageService';
import { Navigate, useNavigate } from "react-router-dom";


const NeurodivergentResourcesPage = () => {
  // Helper function for consistent card motion animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Stagger animation
        duration: 0.5,
      },
    }),
  };

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const hasLoggedRef = useRef(false);
  const [setUsage] = useState<any>(null);
  const [ setPlanLimits] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      getUserUsage(user.uid).then(u => {
        setUsage(u);
        setPlanLimits(getPlanLimits(u.plan));
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid && !hasLoggedRef.current) {
      logActivity(user.uid, {
        type: ActivityTypes.PAGE_VISIT,
        action: 'Visited MindZone', // Change this for each page
        details: 'Accessed mindzone resources page',
      });
      hasLoggedRef.current = true;
    }
  }, [user]);

   useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500); 
    }, []);

    useEffect(() => {
      if (user?.uid) {
        getUserUsage(user.uid).then(userUsage => {
          // Check if user has mindzone access
          if (!userUsage.mindzone) {
            // toast.error("Please upgrade your plan to access MindZone");
            navigate('/', { 
              state: { message: "Upgrade your plan to access MindZone." }
            });
          }
        });
      }
    }, [user, navigate]);

    if (!user?.uid) {
      return <Navigate to="/login" />;
    }
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

  return (
    <div>
      <Navigation />
    <div className="bg-gray-950 min-h-screen text-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Neurodivergent</span> Minds
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Discover resources, tools, and support tailored for ADHD, dyslexia,
              and the diverse spectrum of neurodivergence. Find strategies to thrive.
            </p>
          </motion.div>
        </section>

        {/* Self-Assessment Tools */}
        <section className="mb-20">
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-violet-400 mb-4 text-center">
              Understand Your Traits
            </h2>
             <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl mx-auto">
               Self-discovery is key. These tools offer insights, but remember they are not a substitute for professional diagnosis.
             </p>
          </motion.div>
          <motion.div
             className="grid md:grid-cols-3 gap-8"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is visible
             variants={{
                visible: { transition: { staggerChildren: 0.1 } } // Stagger children animations
             }}
          >
            {[ // Array for easier mapping and custom index for delay
              { title: "ADHD Self-Assessment", description: "Explore common ADHD traits with this introductory self-assessment.", link: "https://www.clinical-partners.co.uk/for-adults/adult-adhd-add/test-for-adhd", linkText: "Take Test", external: true },
              { title: "Dyslexia Screening", description: "A quick screening tool to identify potential indicators of dyslexia.", link: "/screening", linkText: "Start Screening" },
              { title: "Neurodiversity Quiz", description: "Identify potential neurodivergent traits through this introductory quiz.", link: "/quiz", linkText: "Take Quiz" },
            ].map((item, index) => (
              <motion.div key={item.title} variants={cardVariants} custom={index}>
                <Card className="bg-gray-800/70 border border-gray-700 shadow-lg hover:border-violet-500 transition-colors duration-300 rounded-xl h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-violet-300">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="text-gray-400 mb-6 flex-grow">{item.description}</CardDescription>
                    <Button
                      variant="outline" // Assuming 'outline' variant exists and can be styled
                      className="w-full mt-auto bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-violet-500 transition-all duration-300 rounded-md group"
                      asChild // Use asChild if Button component supports it for Link integration
                    >
                      <Link to={item.link} target={item.external ? "_blank" : "_self"} rel={item.external ? "noopener noreferrer" : ""}>
                        {item.linkText}
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Educational Resources */}
        <section className="mb-20">
           <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.6 }}
           >
             <h2 className="text-3xl sm:text-4xl font-semibold text-violet-400 mb-10 text-center">
               Learn & Understand
             </h2>
           </motion.div>
          <motion.div
             className="grid md:grid-cols-2 gap-8"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
             variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
           >
             {[
               { title: "Insightful Articles", description: "Curated articles explaining various aspects of neurodivergence.", link: "/articles", linkText: "Read Articles" },
               { title: "Explainer Videos", description: "Watch informative videos covering ADHD, dyslexia, and more.", link: "/videos", linkText: "Watch Videos" },
             ].map((item, index) => (
               <motion.div key={item.title} variants={cardVariants} custom={index}>
                <Card className="bg-gray-800/70 border border-gray-700 shadow-lg hover:border-violet-500 transition-colors duration-300 rounded-xl h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-violet-300">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="text-gray-400 mb-6 flex-grow">{item.description}</CardDescription>
                     <Button
                       variant="outline"
                       className="w-full mt-auto bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-violet-500 transition-all duration-300 rounded-md group"
                       asChild
                     >
                       <Link to={item.link}>
                         {item.linkText}
                         <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                     </Button>
                  </CardContent>
                </Card>
               </motion.div>
             ))}
          </motion.div>
        </section>

        {/* Practical Tools and Strategies */}
         <section className="mb-20">
           <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.6 }}
           >
             <h2 className="text-3xl sm:text-4xl font-semibold text-violet-400 mb-4 text-center">
               Tools to Support Your Journey
             </h2>
              <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl mx-auto">
                Leverage technology and strategies designed to assist with organization, focus, and reading.
              </p>
           </motion.div>
           <motion.div
             className="grid md:grid-cols-3 gap-8"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
             variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
           >
             {[
               { title: "Task Management Apps", description: "Recommended apps to help structure tasks and stay organized.", link: "https://play.google.com/store/search?q=Task%20Management%20Apps%20for%20ADHD&c=apps&hl=en", linkText: "Explore Apps", external: true },
               { title: "Reading Aids", description: "Tools designed to assist with reading challenges, like text-to-speech.", link: "/reading-aids", linkText: "View Tools" },
               { title: "Focus Enhancers", description: "Discover browser extensions and apps to minimize distractions and improve focus.", link: "/focus-enhancers", linkText: "Discover Tools" },
             ].map((item, index) => (
               <motion.div key={item.title} variants={cardVariants} custom={index}>
                 <Card className="bg-gray-800/70 border border-gray-700 shadow-lg hover:border-violet-500 transition-colors duration-300 rounded-xl h-full flex flex-col">
                   <CardHeader>
                     <CardTitle className="text-xl font-semibold text-violet-300">{item.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="flex-grow flex flex-col">
                     <CardDescription className="text-gray-400 mb-6 flex-grow">{item.description}</CardDescription>
                     <Button
                       variant="outline"
                       className="w-full mt-auto bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-violet-500 transition-all duration-300 rounded-md group"
                       asChild
                     >
                       <Link to={item.link} target={item.external ? "_blank" : "_self"} rel={item.external ? "noopener noreferrer" : ""}>
                         {item.linkText}
                         <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       </Link>
                     </Button>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </motion.div>
         </section>

        {/* Community and Support */}
        <section className="mb-12">
           <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.6 }}
           >
             <h2 className="text-3xl sm:text-4xl font-semibold text-violet-400 mb-4 text-center">
               Connect & Find Support
             </h2>
             <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl mx-auto">
               You're not alone. Connect with peers for shared experiences, advice, and mutual support in understanding communities.
             </p>
           </motion.div>
           <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
            >
             {[
               { title: "Online Forums", description: "Join dedicated online forums for discussions, Q&A, and support.", link: "/online-forums", linkText: "Join Forums" },
               { title: "Support Groups", description: "Find virtual or local support groups to connect with others who understand.", link: "/support-groups", linkText: "Find Support" },
             ].map((item, index) => (
               <motion.div key={item.title} variants={cardVariants} custom={index}>
                 <Card className="bg-gray-800/70 border border-gray-700 shadow-lg hover:border-violet-500 transition-colors duration-300 rounded-xl h-full flex flex-col">
                   <CardHeader>
                     <CardTitle className="text-xl font-semibold text-violet-300">{item.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="flex-grow flex flex-col">
                     <CardDescription className="text-gray-400 mb-6 flex-grow">{item.description}</CardDescription>
                     <Button
                        variant="outline"
                        className="w-full mt-auto bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-violet-500 transition-all duration-300 rounded-md group"
                        asChild
                      >
                       <Link to={item.link}>
                         {item.linkText}
                         <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </Button>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </motion.div>
        </section>

      </div>

      <Footer /> 
    </div>
    </div>
  );
};

export default NeurodivergentResourcesPage;









//Claude



// import { motion } from "framer-motion";
// import { Button } from "../components/ui/button";
// import { Card } from "../components/ui/card";
// import { Navigation } from '../components/navigation';
// import { Footer } from '../components/footer';
// import { Link } from "react-router-dom";

// const NeurodivergentResourcesPage = () => {
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
//             <Navigation />
//             {/* Decorative blob similar to homepage */}
//             <div className="fixed top-0 right-0 w-1/2 h-screen pointer-events-none opacity-40 z-0">
//                 <motion.div 
//                     className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 rounded-full blur-3xl"
//                     animate={{
//                         scale: [1, 1.2, 1],
//                         rotate: [0, 10, 0],
//                     }}
//                     transition={{
//                         duration: 20,
//                         repeat: Infinity,
//                         repeatType: "reverse"
//                     }}
//                 />
//             </div>

//             <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
//                 {/* Hero Section */}
//                 <section className="text-center mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
//                             Empowering Neurodivergent Minds
//                         </h1>
//                     </motion.div>
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5, duration: 1 }}>
//                         <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//                             Discover resources, tools, and support tailored for ADHD, dyslexia,
//                             and neurodivergent individuals to help you focus, understand and navigate with ease.
//                         </p>
//                     </motion.div>
//                 </section>

//                 {/* Self-Assessment Tools */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-300 mb-4">
//                             Understand Your Neurodivergent Traits
//                         </h2>
//                     </motion.div>
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.3, duration: 1 }}>
//                         <p className="text-lg text-gray-300 mb-6">
//                             It's important to understand your neurodivergent traits to better
//                             navigate daily life. Here are some tools you can use:
//                         </p>
//                     </motion.div>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">ADHD Self-Assessment</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Take this self-assessment to understand more about ADHD traits.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="https://www.clinical-partners.co.uk/for-adults/adult-adhd-add/test-for-adhd" target="_blank"> Take Test </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-pink-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-pink-300 mb-2">Dyslexia Screening</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     A quick screening tool to identify potential dyslexia traits.
//                                 </p>
//                                 <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
//                                     <Link to="/screening"> Start Screening </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">Neurodivergent Quiz</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Identify neurodivergent traits through this quiz.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="/quiz"> Take Quiz </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                     </div>
//                 </section>

//                 {/* Educational Resources */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-300 mb-4">
//                             Learn More About Neurodivergence
//                         </h2>
//                     </motion.div>
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">Articles</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Curated articles to help you understand neurodivergence.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="/articles"> Read Articles </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-pink-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-pink-300 mb-2">Videos</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Watch insightful videos about ADHD, dyslexia, and neurodivergence.
//                                 </p>
//                                 <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
//                                     <Link to="/videos"> Watch Videos </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                     </div>
//                 </section>

//                 {/* Practical Tools and Strategies */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-300 mb-4">
//                             Tools to Support Your Journey
//                         </h2>
//                     </motion.div>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">Task Management Apps</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Recommended apps to help you stay organized and manage tasks.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="https://play.google.com/store/search?q=Task%20Management%20Apps&c=apps&hl=en_IN"> Explore Apps </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-pink-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-pink-300 mb-2">Reading Aids</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Tools designed to assist with reading difficulties.
//                                 </p>
//                                 <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
//                                     <Link to="/reading-aids"> View Tools </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">Focus Enhancers</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Enhance focus with these proven tools.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="/focus-enhancers"> Discover Tools </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                     </div>
//                 </section>

//                 {/* Community and Support */}
//                 <section className="mb-16">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 1 }}>
//                         <h2 className="text-3xl font-semibold text-purple-300 mb-4">
//                             Join the Neurodivergent Community
//                         </h2>
//                     </motion.div>
//                     <p className="text-lg text-gray-300 mb-6">
//                         Connect with others for support and shared experiences. Here are some
//                         great ways to get involved:
//                     </p>
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-purple-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-purple-300 mb-2">Online Forums</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Join online forums for discussions and support.
//                                 </p>
//                                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
//                                     <Link to="/online-forums"> Join Forums </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                         <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
//                             <Card className="p-6 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-500/20 transition-all rounded-xl overflow-hidden">
//                                 <div className="h-1 w-full bg-pink-500 absolute top-0 left-0"></div>
//                                 <h3 className="font-semibold text-xl text-pink-300 mb-2">Support Groups</h3>
//                                 <p className="text-sm text-gray-300 mb-4">
//                                     Find virtual or local support groups to connect with others.
//                                 </p>
//                                 <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
//                                     <Link to="/support-groups"> Find Support </Link>
//                                 </Button>
//                             </Card>
//                         </motion.div>
//                     </div>
//                 </section>
                
//                 {/* Call to Action */}
//                 <section className="mb-16 text-center">
//                     <motion.div 
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 1 }}
//                         className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-8 rounded-2xl max-w-3xl mx-auto"
//                     >
//                         <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Journey?</h2>
//                         <p className="text-lg text-gray-300 mb-6">
//                             Get personalized assistance to help you focus, understand, and navigate with ease.
//                         </p>
//                         <div className="flex flex-wrap gap-4 justify-center">
//                             <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
//                                 Get Started
//                             </Button>
//                             <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900/30 px-8 py-3 text-lg">
//                                 Focus Mode
//                             </Button>
//                         </div>
//                     </motion.div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default NeurodivergentResourcesPage;











//ChatGPT


// import { motion } from "framer-motion";
// import { Button } from "../components/ui/button";
// import { Card } from "../components/ui/card";
// import { Navigation } from '../components/navigation';
// import { Footer } from '../components/footer';
// import { Link } from "react-router-dom";

// const NeurodivergentResourcesPage = () => {
//   return (
//     <div className="bg-black text-white min-h-screen overflow-hidden">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="text-center py-24 relative bg-gradient-to-b from-black via-gray-900 to-black rounded-xl shadow-xl overflow-hidden">
//         <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl opacity-60 animate-pulse z-0" />
//         <motion.div
//           className="relative z-10"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
//             Empowering Neurodivergent Minds
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Smart, adaptive tools & resources to help you focus, grow, and thrive with ease.
//           </p>
//           <div className="flex justify-center gap-4 mt-10">
//             <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg rounded-full shadow-md transition-all">
//               Get Started
//             </Button>
//             <Button
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-black px-6 py-3 text-lg rounded-full transition-all"
//             >
//               Focus
//             </Button>
//           </div>
//         </motion.div>
//       </section>

//       {/* Tools Section */}
//       <section className="max-w-7xl mx-auto py-20 px-6">
//         <h2 className="text-4xl font-bold text-white mb-6 text-center">
//           Adaptive Tools
//         </h2>
//         <p className="text-lg text-gray-400 mb-12 text-center max-w-2xl mx-auto">
//           Explore tools designed for the neurodivergent community – from noise blockers to smart schedulers.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {["Noise Blocker", "Task Timer", "Routine Builder"].map((tool) => (
//             <div
//               key={tool}
//               className="p-6 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all"
//             >
//               <h3 className="text-xl font-semibold mb-2">{tool}</h3>
//               <p className="text-gray-400">
//                 A powerful tool to help improve focus and reduce sensory overload.
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Resources Section */}
//       <section className="bg-gray-950 py-20 px-6">
//         <h2 className="text-4xl font-bold text-white mb-6 text-center">
//           Curated Resources
//         </h2>
//         <p className="text-lg text-gray-400 mb-12 text-center max-w-2xl mx-auto">
//           Handpicked articles, videos, and tips for better mental health, productivity, and mindfulness.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {["Neurodivergent Productivity", "Mindfulness Tips", "Support Networks"].map((res) => (
//             <div
//               key={res}
//               className="p-6 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all"
//             >
//               <h3 className="text-xl font-semibold mb-2">{res}</h3>
//               <p className="text-gray-400">
//                 Practical advice and support strategies tailored for neurodivergent individuals.
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Community CTA Section */}
//       <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-20 text-center px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-4xl font-bold text-white mb-6">
//             Join Our Community
//           </h2>
//           <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
//             Connect with others, share your journey, and find the support you need.
//           </p>
//           <Button className="bg-white text-black px-6 py-3 text-lg rounded-full hover:bg-purple-600 hover:text-white transition-all">
//             Connect Now
//           </Button>
//         </motion.div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default NeurodivergentResourcesPage;
