import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useNavigate } from 'react-router-dom';

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [completedLetters, setCompletedLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const lettersPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    getLetters();
    getUserProgress();
  }, []);

  const getLetters = () => {
    api
      .get("/api/letters/")
      .then((res) => {setLetters(res.data); console.log(res.data)})
      .catch((err) => alert(err));
  };

  const getUserProgress = () => {
    api
      .get("/api/get_user_progress/")
      .then((res) => {
        setCompletedLetters(res.data.completed_letters); 
        console.log(res.data.completed_letters)
      })
      .catch((err) => console.error("Error fetching progress:", err));
  };

  const handleClick = (letter) => {
    navigate(`/letters/${letter.id}`, { state: { letter } });
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * lettersPerPage < letters.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedLetters = letters.slice(
    currentPage * lettersPerPage,
    (currentPage + 1) * lettersPerPage
  );

  const handleStart = () => {
    const ignoredLetters = ["ഋ", "൯", "ൺ", "ർ", "ൽ", "ൾ"];
  
    const incompleteLetter = letters.find(
      (letter) => !completedLetters.includes(letter.letter) && !ignoredLetters.includes(letter.letter)
    );
  
    const targetLetter = incompleteLetter || letters.find(letter => !ignoredLetters.includes(letter.letter));
  
    if (targetLetter) {
      navigate(`/letters/${targetLetter.id}`, { state: { letter: targetLetter } });
    }
  };

  return (
    <div className="bg-a_bg pb-10">
      <Navbar activeIndex={1} isFixed={false} />
      <div className="relative h-[600px] w-full overflow-hidden mb-20">
        <div 
          className="absolute inset-0 flex justify-center items-center pointer-events-none blur-lg mb-10 text-black opacity-20"
          style={{ fontSize: '500px', fontWeight: 'bold'}}
        >
          അ
        </div>
        
        <div className="relative z-10 flex flex-row justify-between items-center px-40 text-text_main text-[70px] h-full">
          <div className="flex flex-col gap-20 pl-10 mt-6">
            <p className="font-inria">Malayalam<br />Letters</p>
            <p className="font-arima">മലയാളം<br />അക്ഷരങ്ങൾ</p>
          </div>
          
          <div className="flex flex-col justify-between items-center self-start h-full pt-[80px]">
            <p className="text-black font-inria text-[25px] border-2 border-black rounded-2xl px-10 py-16">Master Malayalam script with <br /> interactive writing, AI-powered <br /> feedback, and real-world examples!</p>
            <button 
              className="w-40 font-inria text-[30px] text-a_bg py-3 bg-text_main rounded-3xl mb-32"
              onClick={handleStart}
            >
              <p>Start</p>
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 mt-[36px]">
        <Divider />
      </div>

      <div className="flex flex-col items-center font-inria">
        <p className="text-text_green my-[50px] text-[35px] font-bold">Letters</p>
        <div className="flex flex-wrap gap-16 justify-center px-[50px]">
        {displayedLetters
          .filter((item) => !["ഋ", "൯", "ൺ", "ർ", "ൽ", "ൾ"].includes(item.letter))
          .map((item) => (
            <button
              key={item.id}
              className={`bg-transparent px-4 py-2 rounded-xl font-arima text-[50px] border-[3px] w-[150px] border-black hover:shadow-lg hover:font-bold transition-all
                ${completedLetters.includes(item.letter) ? "text-a_sc" : "text-black"}`}
              onClick={() => handleClick(item)}
            >
              {item.letter}
            </button>
          ))}
        </div>
        <div className="flex mt-[120px] gap-5">
        <button 
          className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          >
          Previous
        </button>
        <button 
          className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
          onClick={handleNextPage} 
          disabled={(currentPage + 1) * lettersPerPage >= letters.length}
        >
          Next
        </button>

        </div>
      </div>
    </div>
  );
};

export default Letters;