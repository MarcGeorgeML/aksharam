import { motion } from 'framer-motion';
import '../styles/LandingPageStyles.css';
import { useNavigate } from 'react-router-dom';

const sentences = [
  { text: "Relearn with confidence", image: "/assets/idea.png" },
  { text: "Progress with ease", image: "/assets/progress.png" },
  { text: "Come explore Malayalam", image: "/assets/loupe.png" }
];

const LandingPage = () => {
  const navigate = useNavigate(); 

  // Create a doubled array for seamless looping
  const extendedSentences = [...sentences, ...sentences, ...sentences];

  return (
    <>
      <div className="landing-container">
        {/* Logo */}
        <img src="/logo.svg" alt="Logo" className="logo" />

        {/* Aksharam Text & Start Learning Button */}
        <div className="center-content">
          <div className="text-container">
            {"Aksharam".split("").map((letter, index) => (
              <span key={index} className="animated-letter" style={{ animationDelay: `${index * 0.2}s` }}>
                {letter}
              </span>
            ))}
          </div>

          {/* Start Learning Button */}
          <button className="start-learning-button" onClick={() => navigate('/home')}>Start Learning</button>
        </div>

        {/* Login & Sign Up Buttons */}
        <div className="button-container">
          <button className="login-button" onClick={() => navigate('/home')}>Login</button>
          <button className="signup-button" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </div>
      <hr className="divider-line" />

      {/* Improved Sliding Frame Animation */}
      <div className="sliding-frame-container">
        <div className="infinite-slider-container">
          {/* First set of slides for continuous loop */}
          {extendedSentences.map((item, idx) => (
            <div className="frame-content" key={idx}>
              <p className="frame-text">{item.text}</p>
              <img src={item.image} alt="Frame Icon" className="frame-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* Description Image */}
      <img src="/assets/description_sec.png" alt="Description Section" className="description-image" />
      {/* Section Title */}
      <h2 className="section-title">What does Aksharam provide?</h2>
      {/* Features Section */}
      <div className="features-container">
        {/* Feature 1 */}
        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3>Master Malayalam Characters with AI</h3>
          <img src="/assets/AA icon.png" alt="Feature 1" className="feature-icon" />
          <p>Learn how to read, write and pronounce Malayalam characters. Practice on a digital canvas, and our machine learning model will analyze your strokes to help you improve your skills</p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3>Understand Malayalam Words and Sentences</h3>
          <img src="/assets/book icon.png" alt="Feature 2" className="feature-icon" />
          <p>Build your vocabulary with essential words and sentences. Listen to native pronunciations, see words used in real-life sentences, and improve your speaking skills with our lessons.</p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
        >
          <h3>AI-Powered Image Recognition & Translation</h3>
          <img src="/assets/ocr icon.png" alt="Feature 3" className="feature-icon" />
          <p>Leverage advanced AI to extract and translate Malayalam text from images. Identify objects in pictures and instantly learn their Malayalam names, making language learning more intuitive and interactive.</p>
        </motion.div>
      </div>
    </>
  );
};

export default LandingPage;