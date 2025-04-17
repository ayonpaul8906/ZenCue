import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const questions = [
  { question: "Do you often get easily distracted by your surroundings or thoughts?" },
  { question: "Do you have trouble focusing on tasks or conversations?" },
  { question: "Do you frequently forget appointments or lose track of items?" },
  { question: "Do you find it difficult to sit still or feel restless often?" },
  { question: "Do you struggle with reading, especially mixing up letters or words?" },
  { question: "Do you find it easier to understand things visually than through text?" },
  { question: "Do you get overwhelmed in loud or crowded environments?" },
  { question: "Do you feel like your brain is constantly active or racing?" },
  { question: "Do you experience difficulty in organizing tasks or managing time?" },
  { question: "Do you often feel socially different or misunderstood?" },
  { question: "Do you have strong interests or hobbies that you deeply focus on?" },
  { question: "Have others described your behavior or thinking as ‘unique’ or ‘unusual’?" },
];

export default function NeurodivergentQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const updatedAnswers = [...answers, score];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers(updatedAnswers);
    } else {
      setAnswers(updatedAnswers);
      setShowResult(true);
    }
  };

  const getResult = () => {
    const total = answers.reduce((sum, a) => sum + a, 0);
    if (total >= 36) return "You may have strong neurodivergent traits. Consider exploring further or consulting a professional.";
    if (total >= 24) return "You show some signs of neurodivergent patterns. You might benefit from learning more about ADHD, dyslexia, or autism.";
    return "You may have fewer traits related to neurodivergence. Everyone’s brain is different — self-awareness is key!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbff] to-[#f5ebff] p-6 md:p-12 text-gray-800 font-sans relative overflow-hidden">
      <motion.button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-4 transition"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </motion.button>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
            Neurodivergent Quiz
          </h1>

          {!showResult ? (
            <>
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  Question {currentQuestion + 1} / {questions.length}
                </div>
                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-3 bg-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <motion.h2
                className="text-xl font-semibold text-purple-800 mb-4"
                key={currentQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {questions[currentQuestion].question}
              </motion.h2>

              <div className="grid gap-4">
                {[
                  { label: "Not at all", icon: "🙅", score: 1 },
                  { label: "Rarely", icon: "🌀", score: 2 },
                  { label: "Sometimes", icon: "🤔", score: 3 },
                  { label: "Often", icon: "🔄", score: 4 },
                  { label: "Very Often", icon: "🔥", score: 5 },
                ].map(({ label, icon, score }) => (
                  <motion.button
                    key={label}
                    onClick={() => handleAnswer(score)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                  >
                    <span className="text-xl">{icon}</span> {label}
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-purple-700 mb-4">🎉 Result</h2>
              <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
                {getResult()}
              </p>
              <button
                onClick={() => {
                  setAnswers([]);
                  setCurrentQuestion(0);
                  setShowResult(false);
                }}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700"
              >
                Restart Quiz
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
