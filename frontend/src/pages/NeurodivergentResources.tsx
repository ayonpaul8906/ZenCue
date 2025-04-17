import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'
import { Link } from "react-router-dom"

const NeurodivergentResourcesPage = () => {
    return (
        <div><Navigation />
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        <h1 className="text-4xl font-extrabold text-purple-900 mb-4">
                            Empowering Neurodivergent Minds
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}>
                        <p className="text-lg text-gray-600">
                            Discover resources, tools, and support tailored for ADHD, dyslexia,
                            and neurodivergent individuals.
                        </p>
                    </motion.div>
                </section>

                {/* Self-Assessment Tools */}
                <section className="mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        <h2 className="text-3xl font-semibold text-purple-900 mb-4">
                            Understand Your Neurodivergent Traits
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}>
                        <p className="text-lg text-gray-600 mb-6">
                            It's important to understand your neurodivergent traits to better
                            navigate daily life. Here are some tools you can use:
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">ADHD Self-Assessment</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Take this self-assessment to understand more about ADHD traits.
                            </p>
                            <Button variant="outline" className="w-full">
                                <Link to="https://www.clinical-partners.co.uk/for-adults/adult-adhd-add/test-for-adhd" > Take Test </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Dyslexia Screening</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                A quick screening tool to identify potential dyslexia traits.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/screening" > Start Screening </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Neurodivergent Quiz</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Identify neurodivergent traits through this quiz.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/quiz" > Take Quiz </Link>
                            </Button>
                        </Card>
                    </div>
                </section>

                {/* Educational Resources */}
                <section className="mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        <h2 className="text-3xl font-semibold text-purple-900 mb-4">
                            Learn More About Neurodivergence
                        </h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Articles</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Curated articles to help you understand neurodivergence.
                            </p>
                            <Button variant="outline" className="w-full">
                                <Link to="/articles" > Read Articles </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Videos</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Watch insightful videos about ADHD, dyslexia, and neurodivergence.
                            </p>
                            <Button variant="outline" className="w-full">
                                <Link to="/videos" > Watch Videos </Link>
                            </Button>
                        </Card>
                    </div>
                </section>

                {/* Practical Tools and Strategies */}
                <section className="mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        <h2 className="text-3xl font-semibold text-purple-900 mb-4">
                            Tools to Support Your Journey
                        </h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Task Management Apps</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Recommended apps to help you stay organized and manage tasks.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="https://play.google.com/store/search?q=Task%20Management%20Apps&c=apps&hl=en_IN" > Explore Apps </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Reading Aids</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Tools designed to assist with reading difficulties.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/reading-aids" > View Tools </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Focus Enhancers</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Enhance focus with these proven tools.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/focus-enhancers" > Discover Tools </Link>
                            </Button>
                        </Card>
                    </div>
                </section>

                {/* Community and Support */}
                <section className="mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        <h2 className="text-3xl font-semibold text-purple-900 mb-4">
                            Join the Neurodivergent Community
                        </h2>
                    </motion.div>
                    <p className="text-lg text-gray-600 mb-6">
                        Connect with others for support and shared experiences. Here are some
                        great ways to get involved:
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Online Forums</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Join online forums for discussions and support.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/online-forums" > Join Forums </Link>
                            </Button>
                        </Card>
                        <Card className="p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                            <h3 className="font-semibold text-xl text-purple-700 mb-2">Support Groups</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Find virtual or local support groups to connect with others.
                            </p>
                            <Button variant="outline" className="w-full">
                            <Link to="/support-groups" > Find Support </Link> 
                            </Button>
                        </Card>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default NeurodivergentResourcesPage;
