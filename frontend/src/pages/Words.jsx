// import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
// import { useNavigate } from 'react-router-dom';
// import api from "../api";

// const fetchWords = async (setWordsData) => {
//     try {
//         const response = await api.get("/api/words/");
//         console.log(response.data); // Log response for debugging
//         setWordsData(response.data.Words);
//     } catch (error) {
//         console.error("Error fetching words:", error);
//     }
// };


const Words = () => {
    // const [sentences, setsentence] = useState([]);
    // const navigate = useNavigate();
    // const [wordsData, setWordsData] = useState([]);

    // useEffect(() => {
    //   fetchWords(setWordsData);
    // }, []);

    const wordData = {
        1 : "അമ്മ",
        2 : "അച്ചൻ",
        3 : "മകൻ",
        4 : "മകൾ"
    }

    const thingData = {
        1 : "കുപ്പി",
        2 : "പുസ്തകം",
        3 : "കണ്ണാടി",
        4 : "വെളിച്ചം"
    }

    return (
        <div className="bg-a_bg pb-20">
          <Navbar activeIndex={2} />      
         <div className="flex flex-row justify-evenly pb-10">
          <img src="/assets/amma.png" alt="A traditional representation of Amma" className="w-[600px]" />
          <button className="w-32 font-inria self-end text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl mb-[42px] mr-[97px]">
              <p>Start</p>
            </button>
          <div className="flex flex-row justify-between items-center text-a_sc text-[60px] gap-[100px] w-[600px]">
           <div className="flex flex-col gap-5 pl-[10px]">
            <p className="font-inria">Malayalam<br />Words</p>
            <p className="font-arima">മലയാളം<br />വാക്കുകൾ</p>
            <p className="text-black font-inria text-[20px]">
            Learn essential Malayalam words and sentences to improve your everyday conversations!
            </p>
           </div>
          </div>
         </div>
         <div className="px-5">
          <Divider />
         </div>

         <div className="flex flex-col items-center font-inria">
          <p className="text-text_green my-[50px] text-[50px] font-bold">Relationships</p>
          <div className="flex flex-wrap gap-16 justify-center px-5">
            {Object.keys(wordData).map((key) => {
                const button = wordData[key];
                return (
                    <div key={key} className="w-1/2 sm:w-1/3 md:w-1/4 flex justify-center items-center">
                     <button key={key} className="w-full h-[80px] bg-transparent text-black px-[30px] py-2 rounded-xl font-arima text-[35px] border-[3px] border-black">
                        {button}
                     </button>
                     </div>
                );
                })}
          </div>
         </div>

         <div className="px-5">
            <Divider />
         </div>

         <div className="flex flex-col items-center font-inria">
          <p className="text-text_green my-[50px] text-[50px] font-bold">Things and Objects</p>
          <div className="flex flex-wrap gap-16 justify-center px-5">
            {Object.keys(thingData).map((key) => {
                const button = thingData[key];
                return (
                    <div key={key} className="w-1/2 sm:w-1/3 md:w-1/4 flex justify-center items-center">
                     <button key={key} className="w-full h-[80px] bg-transparent text-black px-[30px] py-2 rounded-xl font-arima text-[35px] border-[3px] border-black">
                        {button}
                     </button>
                    </div>
                );
                })}
          </div>
         </div>
        </div>
      );
      
};      

export default Words;

