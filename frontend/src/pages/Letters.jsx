import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useNavigate } from 'react-router-dom';

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [completedLetters, setCompletedLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const lettersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    getLetters();
    getUserProgress();
  }, []);

  const getLetters = () => {
    api
      .get("/api/letters/")
      .then((res) => setLetters(res.data))
      .catch((err) => alert(err));
  };

  const getUserProgress = () => {
    api
      .get("/api/get_user_progress/")
      .then((res) => setCompletedLetters(res.data.completed_letters))
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

  return (
    <div className="bg-a_bg pb-20">
      <Navbar activeIndex={1} />
      <div className="flex flex-row justify-between items-center px-[100px] text-a_sc text-[60px]">
        <div className="flex flex-col gap-5 pl-[40px]">
          <p className="font-inria">Malayalam<br />Letters</p>
          <p className="font-arima">മലയാളം<br />അക്ഷരങ്ങൾ</p>
          <p className="text-black font-inria text-[20px]">Master Malayalam script with <br /> interactive writing, AI-powered <br /> feedback, and real-world examples!</p>
        </div>
          <button className="w-32 font-inria self-end mb-20 text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl ml-[90px]">
            <p>Start</p>
          </button>
        <img src="/assets/letter.png" alt="letter" className="w-[600px]" />
      </div>

      <div className="px-5">
        <Divider />
      </div>

      <div className="flex flex-col items-center font-inria">
        <p className="text-text_green my-[50px] text-[35px]">Letters</p>
        <div className="flex flex-wrap gap-16 justify-center px-[50px]">
          {displayedLetters.map((item) => (
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
        <div className="flex mt-10 gap-5">
          <button 
            className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg" 
            onClick={handlePrevPage} 
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button 
            className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg" 
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