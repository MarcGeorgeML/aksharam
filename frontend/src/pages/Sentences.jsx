import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Sentences = () => {
  const [sentences, setSentences] = useState([]);
  const [completedSentences, setCompletedSentences] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const sentencesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    getSentences();
    getUserProgress();
  }, []);

  const getSentences = () => {
    api
      .get("/api/sentences/")
      .then((res) => {
        console.log("Sentences API Response:", res.data); // Log full response
        setSentences(res.data.Sentences);
      })
      .catch((err) => console.error("Error fetching sentences:", err));
  };  

  const getUserProgress = () => {
    api
      .get("/api/get_user_progress/")
      .then((res) => setCompletedSentences(res.data.completed_sentences))
      .catch((err) => console.error("Error fetching progress:", err));
  };

  const handleClick = (sentence) => {
    navigate(`/sentences/${sentence.id}`, { state: { sentence } });
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * sentencesPerPage < sentences.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedSentences = sentences.slice(
    currentPage * sentencesPerPage,
    (currentPage + 1) * sentencesPerPage
  );

  return (
    <div className="bg-a_bg pb-20">
      <Navbar activeIndex={3} />
      <div className="flex flex-row justify-between items-center px-[100px] text-a_sc text-[60px]">
        <div className="flex flex-col gap-5 pl-[40px] mt-[37px]">
          <p className="font-inria">Malayalam<br />Sentences</p>
          <p className="font-arima">മലയാളം<br />വാക്യങ്ങൾ</p>
          <p className="text-black font-inria text-[20px]">
            Learn basic Malayalam <br /> sentences to improve <br /> your everyday conversations!
          </p>
        </div>
        <button className="w-32 font-inria self-end mb-[42px] text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl ml-[207px]">
          <p>Start</p>
        </button>
        <img src="/assets/amma.png" alt="A traditional representation of Amma" className="w-[600px] relative left-8" />
      </div>

      <div className="px-5 mt-[50px]">
        <Divider />
      </div>

      <div className="flex flex-col items-center font-inria">
        <p className="text-text_green my-[50px] text-[35px]">Sentences</p>
        <div className="flex flex-col gap-6 px-[50px] w-full max-w-[800px]">
          {displayedSentences.map((item) => (
            <button
              key={item.sentence}
              className={`bg-transparent px-6 py-4 rounded-xl font-arima text-[30px] border-[3px] border-black hover:shadow-lg transition-all text-left w-full 
                ${completedSentences.includes(item.sentence) ? "text-a_sc border-black" : "text-black border-black"}`}
              onClick={() => handleClick(item)}
            >
              {item.sentence}
            </button>
          ))}
        </div>

        <div className="flex mt-10 gap-5">
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
            disabled={(currentPage + 1) * sentencesPerPage >= sentences.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sentences;
