import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-a_bg relative">
      {/* Navbar */}
      <Navbar activeIndex={0} className="relative z-20" />

      {/* Background Images */}
      <div className="absolute top-16 w-full h-full">
        <img
          src="/assets/home_bg_l.png"
          alt="Left Background"
          className="absolute left-0 top-0 h-full object-cover z-0"
        />
        <img
          src="/assets/home_bg_r.png"
          alt="Right Background"
          className="absolute right-0 top-0 h-full object-cover z-0"
        />
      </div>

      {/* Content Section */}
      <div className="flex h-full flex-col justify-center items-center font-inria relative z-10">
        <div className="w-fit flex flex-col">
          <h1 className="text-[30px] font-inria text-black mb-5 self-start pl-2">
            Start Learning!
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-6 pb-20 pt-3">
            {/* Letters Button */}
            <button
              onClick={() => navigate("/letters")}
              className="group w-[300px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <img
                src="assets/home_letter.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-2xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Letters
              </span>
            </button>

            {/* Words Button */}
            <button
              onClick={() => navigate("/words")}
              className="group w-[300px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <img
                src="assets/home_word.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-2xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Words
              </span>
            </button>

            {/* Sentences Button */}
            <button
              onClick={() => navigate("/sentences")}
              className="group w-[300px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <span className="absolute text-text_green text-2xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Sentences
              </span>
            </button>

            {/* Smart Scan Button */}
            <button
              onClick={() => navigate("/scan")}
              className="group w-[300px] h-[200px] bg-a_bg border-[2px] border-black rounded-[20px] shadow-lg flex justify-center items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <img
                src="assets/home_scan.png"
                alt=""
                className="w-[80px] transition-opacity duration-300 group-hover:opacity-0"
              />
              <span className="absolute text-text_green text-2xl font-inria opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Smart Scan
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
