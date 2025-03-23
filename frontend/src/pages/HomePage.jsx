import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const malayalamLetters = [
  "അ", "ആ", "ഇ", "ഉ", "ഋ", "എ", "ഏ",
  "ഒ", "ക", "ഖ", "ഗ", "ഘ", "ങ", "ച", "ഛ", "ജ",
  "ഞ", "ട", "ഠ", "ഡ", "ഢ", "ണ", "ത", "ഥ", "ദ", "ധ", "ന",
  "പ", "ഫ", "ബ", "ഭ", "മ", "യ", "ര", "ല", "വ", "ശ", "ഷ",
  "സ", "ഹ", "ള", "ഴ", "റ"
];

const getRandomPosition = () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * (window.innerHeight - 80) + 80 // Ensure particles spawn below the navbar
});

const getRandomVelocity = () => ({
  x: (Math.random() - 0.5) * 0.5,
  y: (Math.random() - 0.5) * 0.5
});

const HomePage = () => {
  const [particles, setParticles] = useState([]);
  const navbarHeight = 80; // Adjust this based on your navbar's height
  const navigate = useNavigate();

  useEffect(() => {
    const createParticles = () => {
      const newParticles = malayalamLetters.map((letter, index) => ({
        id: index,
        letter,
        position: getRandomPosition(),
        velocity: getRandomVelocity()
      }));
      setParticles(newParticles);
    };

    createParticles();
    window.addEventListener("resize", createParticles);
    return () => window.removeEventListener("resize", createParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.position.x + p.velocity.x * 6;
          let newY = p.position.y + p.velocity.y * 6;

          // Ensure particles don't overlap the navbar
          if (newY < navbarHeight) {
            // Reverse the y velocity if particles hit the navbar area
            p.velocity.y = Math.abs(p.velocity.y);
            newY = navbarHeight; // Keep particles from going above the navbar
          }

          // If the particle hits the window boundaries, reverse the velocity
          if (newX < 0 || newX > window.innerWidth) {
            p.velocity.x *= -1;
          }

          if (newY < 0 || newY > window.innerHeight) {
            p.velocity.y *= -1;
          }

          return {
            ...p,
            position: {
              x: newX,
              y: newY
            }
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-a_bg">
      <Navbar /> {/* Navbar stays fixed at the top */}
      
      {/* Floating letters behind the grid */}
      <div className="absolute top-0 left-0 right-0 z-0"> {/* Ensures particles are behind the navbar and grid */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-text_transparent text-6xl font-bold" 
            style={{
              left: p.position.x,
              top: p.position.y
            }}
            //animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {p.letter}
          </motion.div>
        ))}
      </div>


      {/* Centered 2x2 Grid of Buttons */}
      <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 mt-16">
        <p className="text-[30px] font-inria text-black mb-5 self-start pl-2">
          Start Exploring!
        </p>
        <div className="grid grid-cols-2 gap-6 pb-20 pt-3">
          {/* Button 1 */}
          <button onClick={() => navigate("/letters")} className="group w-[250px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <img
                src="assets/home_letter.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-3xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Letters
              </span>
          </button>

          {/* Button 2 */}
          <button onClick={() => navigate("/words")} className="group w-[250px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl">
            <img
                src="assets/home_word.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-3xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Words
              </span>
          </button>

          {/* Button 3 */}
          <button onClick={() => navigate("/sentences")} className="group w-[250px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <img
                src="assets/home_sentence.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-3xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Sentences
              </span>
          </button>

          {/* Button 4 */}
          <button onClick={() => navigate("/scan")} className="group w-[250px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <img
                src="assets/home_scan.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-3xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Smart Scan
              </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
