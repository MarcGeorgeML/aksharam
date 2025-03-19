/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NottFound';
import { useState, useEffect } from "react";
import api from "../api";
//import { Toaster } from "@/components/ui/sonner"
//./import { toast } from "sonner"

const WordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);
  const [words, setWords] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [verified, setVerified] = useState(false); // Tracks verification status

  // Fetch all Words for navigation
    const fetchWords = async () => {
    try {
      const res = await api.get("/api/words/");
      setWords(res.data);
  
      const currentWord = res.data.find((l) => l.id === parseInt(id));
      if (currentWord) {
        setWords(currentWord);
        checkUserProgress(currentWord);
        console.log(currentWord)
      } else {
        setWord(null);
      }
    } catch (error) {
      console.error("Error fetching Words:", error);
    }
    };

   // Check user progress
    const checkUserProgress = async () => {
    if (!word) return;
        try {
          const res = await api.get("/api/get_user_progress/");
          const completedWords = res.data.completed_words;
      
          if (completedWords.includes(word.word)) {
            setVerified(true);
          }
          else {
            setVerified(false);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
          await fetchWords(); 
          setVerified(true);
          setResponseMessage("Verified successfully.");
        };
      
        initialize();
      }, [id]);

    useEffect(() => {
        if (word) {
            setVerified(false);
            checkUserProgress();
        }
    },[word]);

    if (!word) {
        return <NotFound />;
    }

    const handleNext = () => {
        const currentIndex = words.findIndex((l) => l.id === parseInt(id));
    
        if (currentIndex === -1 || currentIndex === words.length - 1) {
          navigate("/words");
        } else {
          const nextWord = words[currentIndex + 1];
          navigate(`/words/${nextWord.id}`);
        }
      };

    const handlePrev = () => {
        const currentIndex = words.findIndex((l) => l.id === parseInt(id));
    
        if (currentIndex > 0) {
          const prevWord = words[currentIndex - 1];
          navigate(`/words/${prevWord.id}`);
        } else {
          navigate("/words");
        }
    };

    return (
    <div className="bg-a_bg h-screen flex flex-col px-10 py-8">
      <div className='flex justify-between'>
        
        <button className="w-6 self-start" onClick={() => {navigate('/words')}}>
          <img src="/assets/close.png" alt="Next" className="-scale-x-100" />
        </button>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        {/* Left Block */}
        <div className='flex  flex-1 justify-between items-center'> 
          <button className="w-8 self-center" onClick={handlePrev}>
            <img src="/assets/back.png" alt="Back" />
          </button>
        </div>

        {/* Divider */}
        <div className="border-l-2 border-gray-500 mx-5 h-[calc(100vh-160px)]"></div>
        
        <div>
          <button className="w-8 self-center" onClick={handleNext}>
            <img src="/assets/back.png" alt="Back" className="-scale-x-100" />
          </button>
        </div>
       </div>
    </div>
    )


      
};

export default WordDetails;