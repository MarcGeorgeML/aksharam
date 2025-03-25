import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Words = () => {
  const [categories, setCategories] = useState([]);
  const [completedWords, setCompletedWords] = useState(new Set());
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await api.get("/api/words/");
        setCategories(res.data.Words || []);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    const fetchCompletedWords = async () => {
      try {
        const res = await api.get("/api/get_user_progress/");
        setCompletedWords(new Set(res.data.completed_words || []));
      } catch (error) {
        console.error("Error fetching completed words:", error);
      }
    };

    fetchWords();
    fetchCompletedWords();
  }, []);

  const currentCategory = categories[currentCategoryIndex] || {};

  const handleClick = (word) => {
    navigate(`/words/${currentCategory.id}/${word.id}`, { state: { word } });
  };

  return (
    <div className="bg-a_bg pb-10">
          <Navbar activeIndex={1} isFixed={false} />
          <div className="relative h-[600px] w-full overflow-hidden mb-20">
            <div 
              className="absolute inset-0 flex justify-center items-center pointer-events-none blur-lg mb-10"
              style={{ fontSize: '500px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.2)' }}
            >
              അ
            </div>
            
            <div className="relative z-10 flex flex-row justify-between items-center px-40 text-text_main text-[70px] h-full">
              <div className="flex flex-col gap-20 pl-10 mt-6">
                <p className="font-inria">Malayalam<br />Words</p>
                <p className="font-arima">മലയാളം<br />വാക്കുകൾ</p>
              </div>
              
              <div className="flex flex-col justify-between items-center self-start h-full pt-[80px]">
                <p className="text-black font-inria text-[25px] border-2 border-black rounded-2xl px-10 py-16">Learn essential Malayalam <br /> words and sentences to improve<br /> your everyday conversations!</p>
                <button className="w-40 font-inria text-[30px] text-a_bg py-3 bg-text_main rounded-3xl mb-32 mr-[37px]">
                  <p>Start</p>
                </button>
              </div>
            </div>
          </div>

      <div className="px-5 mt-[50px]">
        <Divider />
      </div>
        <div className="flex flex-col items-center font-inria">
          <p className="text-text_green my-[50px] text-[35px]">
            {currentCategory.category || "Category"}
          </p>
          <div className="flex flex-wrap gap-16 justify-center px-5">
            {(currentCategory.words ?? []).map((word) => (
              <button
                key={word.id}
                className="bg-transparent px-6 py-5 rounded-xl font-arima text-[30px] border-[3px] w-[250px] border-black hover:shadow-lg hover:font-bold transition-all"
                onClick={() => handleClick(word)}
              >
                <span className={completedWords.has(word.word) ? "text-a_sc" : "text-black"}>
                  {word.word}
                </span>
              </button>
            ))}
          </div>
          <div className="flex mt-[120px] gap-5">
            <button
              className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg disabled:opacity-50 transition-transform duration-200 hover:scale-105"
              onClick={() => setCurrentCategoryIndex((prev) => prev - 1)}
              disabled={currentCategoryIndex === 0}
            >
              Previous
            </button>
            <button
              className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg disabled:opacity-50 transition-transform duration-200 hover:scale-105"
              onClick={() => setCurrentCategoryIndex((prev) => prev + 1)}
              disabled={currentCategoryIndex >= categories.length - 1}
            >
              Next
            </button>
          </div>
        </div>
    </div>
  );
};

export default Words;
