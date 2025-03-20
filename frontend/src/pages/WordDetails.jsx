/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NottFound';
import { useState, useEffect } from "react";
import api from "../api";

const WordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);
  const [words, setWords] = useState([]);
  const [/*verified,*/ setVerified] = useState(false);

  // Fetch all words for navigation
  const fetchWords = async () => {
    try {
      const res = await api.get("/api/words/");
      setWords(res.data);

      const currentWord = res.data.find((w) => w.id === parseInt(id));
      if (currentWord) {
        setWord(currentWord);
        checkUserProgress(currentWord);
      } else {
        setWord(null);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const checkUserProgress = async (currentWord) => {
    if (!currentWord) return;
    try {
      const res = await api.get("/api/get_user_progress/");
      const completedWords = res.data.completed_words;
  
      if (completedWords.includes(currentWord.word)) {
        setVerified(true);
      } else {
        await api.post("/api/update_user_progress/", { word: currentWord.word });
        setVerified(true);
      }
    } catch (error) {
      console.error("Error fetching/updating user progress:", error);
    }
  };
  

  useEffect(() => {
    fetchWords();
  }, [id]);

  if (!word) {
    return <NotFound />;
  }

  // Handle navigation
  const handleNext = () => {
    const currentIndex = words.findIndex((w) => w.id === parseInt(id));
    if (currentIndex === -1 || currentIndex === words.length - 1) {
      navigate("/words");
    } else {
      navigate(`/words/${words[currentIndex + 1].id}`);
    }
  };

  const handlePrev = () => {
    const currentIndex = words.findIndex((w) => w.id === parseInt(id));
    if (currentIndex > 0) {
      navigate(`/words/${words[currentIndex - 1].id}`);
    } else {
      navigate("/words");
    }
  };

  return (
    <div className="bg-a_bg h-screen flex flex-col px-10 py-8">
      <div className='flex justify-between'>
        <button className="w-6 self-start" onClick={() => navigate('/words')}>
          <img src="/assets/close.png" alt="Close" className="-scale-x-100" />
        </button>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        {/* Left Block */}
        <div className='flex flex-1 justify-between items-center'> 
          <button className="w-8 self-center" onClick={handlePrev}>
            <img src="/assets/back.png" alt="Back" />
          </button>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[60px] font-arima">{word.word}</h1>
            <p className="text-lg font-inria">{word.translation}</p>

            {/* Display clickable examples */}
            {word.examples.length > 0 && (
              <div className="border-2 border-black text-[28px] px-10 py-10 rounded-xl">
                <p className="font-inria mb-5">Examples</p>
                {word.examples.map((example, index) => (
                  <div key={index} className="cursor-pointer text-blue-500 underline" 
                       onClick={() => navigate(`/words/${example.id}`)}>
                    <p>
                      • <span className="font-arima">{example.example}</span> - 
                      <span className="font-inria">{example.translation}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='w-8'></div>
        </div>

        {/* Divider */}
        <div className="border-l-2 border-gray-500 mx-5 h-[calc(100vh-160px)]"></div>

        {/* Right Block */}
        <div>
          <button className="w-8 self-center" onClick={handleNext}>
            <img src="/assets/back.png" alt="Next" className="-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
