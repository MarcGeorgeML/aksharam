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
    <div className="bg-a_bg pb-20">
      <Navbar activeIndex={2} />
      <div className="flex flex-row justify-between items-center px-[100px] text-a_sc text-[60px]">
        <div className="flex flex-col gap-5 pl-[40px] mt-[37px]">
          <p className="font-inria">Malayalam<br />Words</p>
          <p className="font-arima">മലയാളം<br />വാക്കുകൾ</p>
          <p className="text-black font-inria text-[20px]">
            Learn essential Malayalam <br /> words and sentences to improve{" "}
            <br /> your everyday conversations!
          </p>
        </div>
        <button className="w-32 font-inria self-end mb-[42px] text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl ml-[220px]">
          <p>Start</p>
        </button>
        <img src="/assets/amma.png" alt="A traditional representation of Amma" className="w-[600px] relative left-8" />
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
          <div className="flex mt-10 gap-5">
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

      <div className="px-5">
        <Divider />
      </div>
    </div>
  );
};

export default Words;
