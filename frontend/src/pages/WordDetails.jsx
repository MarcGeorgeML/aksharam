import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import NotFound from "./NottFound";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const WordDetails = () => {
  const { categoryId, wordId } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await api.get("/api/words/");
        console.log(res.data)
        const allCategories = res.data.Words || [];
        setCategories(allCategories);

        const category = allCategories.find((c) => c.id === parseInt(categoryId));
        if (!category) return setWord(null);

        const words = category.words;
        const foundWord = words.find((w) => w.id === parseInt(wordId));

        if (foundWord) {
          setWord(foundWord);
          checkUserProgress(foundWord);
        } else {
          setWord(null);
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [categoryId, wordId]);

  // Check user progress to see if word is already verified
  const checkUserProgress = async (currentWord) => {
    try {
      const res = await api.get("/api/get_user_progress/");
      console.log(res.data)
      const completedWords = res.data.completed_words || [];
      setVerified(completedWords.includes(currentWord.word));
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const markAsCompleted = async () => {
    try {
      await api.patch("/api/update_user_progress/", { completed_words: [word.word] });
      setVerified(true);
      toast("Well Done! Moving to the next word...", {
        className: "bg-green-500 text-white border border-green-700",
      });
  
      // Move to the next word after a short delay
      setTimeout(() => handleNavigation("next"), 1000);
    } catch (error) {
      console.error("Error verifying word:", error);
    }
  };  

  if (loading) return <div className="text-center text-xl font-bold">Loading...</div>;
  if (!word) return <NotFound />;

  const handleNavigation = (direction) => {
    const categoryIndex = categories.findIndex((c) => c.id === parseInt(categoryId));
    if (categoryIndex === -1) return;
  
    const words = categories[categoryIndex].words;
    const wordIndex = words.findIndex((w) => w.id === parseInt(wordId));
  
    if (direction === "next") {
      if (wordIndex < words.length - 1) {
        navigate(`/words/${categoryId}/${words[wordIndex + 1].id}`);
      } else if (categoryIndex < categories.length - 1) {
        const nextCategory = categories[categoryIndex + 1];
        if (nextCategory.words.length > 0) {
          navigate(`/words/${nextCategory.id}/${nextCategory.words[0].id}`);
        }
      } else {
        navigate("/words"); // Redirect to /words if last word is reached
      }
    } else if (direction === "prev") {
      if (wordIndex > 0) {
        navigate(`/words/${categoryId}/${words[wordIndex - 1].id}`);
      } else if (categoryIndex > 0) {
        const prevCategory = categories[categoryIndex - 1];
        if (prevCategory.words.length > 0) {
          navigate(`/words/${prevCategory.id}/${prevCategory.words[prevCategory.words.length - 1].id}`);
        }
      }
    }
  };
  

  return (
    <div className="bg-a_bg h-screen flex flex-col px-10 py-8 justify-center items-center text-center relative">
      {/* Close Button */}
      <button onClick={() => navigate("/words")} className="absolute top-6 left-6 w-6">
        <img
          src="/assets/close.png"
          alt="Close"
          className="w-8 transition-transform duration-200 hover:scale-110"
        />
      </button>

      {/* Left Arrow Button */}
      <button
        onClick={() => handleNavigation("prev")}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 transition-transform duration-200 hover: scale-110">
        <img src="/assets/back.png" alt="Back" className="w-14" />
      </button>

      {/* Category Name */}
      <h2 className="font-arima absolute top-12 text-[70px] text-a_sc">
        {categories.find((c) => c.id === parseInt(categoryId))?.category || "Category"}
      </h2>

      {/* Word + Translation */}
      <div className="flex flex-col justify-center items-center text-center w-full max-w-[80%] mt-[50px]">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-end pr-[10px]">
            <h1 className="font-inria font-normal text-right whitespace-nowrap text-[70px]">
              {word.word}
            </h1>
          </div>
          <h1 className="text-[70px] font-serif font-normal text-gray-700 mx-1 pl-[50px] pr-[50px]">:</h1>
          <h1 className="font-inria font-normal text-right whitespace-nowrap pr-[60px] text-[50px] text-gray-700">
            {word.word_translation}
          </h1>
        </div>
        
        {/* English Version Aligned to Word */}
        <div className="flex flex-col justify-center items-center text-center">
            <h3 className="font-inria font-normal whitespace-nowrap text-[30px] text-gray-400">
              {word.english_version}
            </h3>
        </div>
      </div>

      {/* Push Completed Button Further Down */}
      <div className="pt-[80px] relative w-60 h-[60px] mx-auto">
        {!verified ? (
          <button
            onClick={markAsCompleted}
            className="w-full font-inria text-[30px] text-a_bg py-3 bg-a_sc rounded-3xl transition-transform duration-200 hover:scale-105"
          >
            Complete
          </button>
        ) : (
          <div className="flex justify-center items-center w-full h-full pt-10">
            <img src="/assets/verified.png" alt="Verified" className="w-20 h-20" />
          </div>
        )}
      </div>


      {/* Right Arrow Button */}
      <button
        onClick={() => handleNavigation("next")}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 transition-transform duration-200 hover:scale-110">
        <img src="/assets/back.png" alt="Next" className="w-14 -scale-x-100" />
      </button>

      {/* Toast Notification */}
      <Toaster richColors unstyled />
    </div>
  );
};

export default WordDetails;
