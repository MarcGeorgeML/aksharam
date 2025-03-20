//import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
//import { useNavigate } from 'react-router-dom';
//import api from "../api";

const Sentences = () => {
    // const [sentences, setSentences] = useState(null);
    // const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     getSentences();
    // }, []);

    // const getSentences = () => {
    //     api
    //         .get("api/sentencess")
    //         .then((res) => res.data.Sentences)
    //         .then((data) => {
    //             setSentences(data);
    //             console.log(data);
    //         })
    //         .catch((err) => alert(err));
    // };

    // const handleClick = (word) => {
    //     navigate(`/sentences/${word.id}`, { state: { word } });
    // };

    // const handleNextCategory = () => {
    //     if (sentences && currentCategoryIndex < sentences.length - 1) {
    //         setCurrentCategoryIndex(currentCategoryIndex + 1);
    //     }
    // };

    // const handlePrevCategory = () => {
    //     if (currentCategoryIndex > 0) {
    //         setCurrentCategoryIndex(currentCategoryIndex - 1);
    //     }
    // };

    return (
        <div className="bg-a_bg pb-20">
            <Navbar activeIndex={3} />
            <div className="flex flex-row justify-between items-center px-[100px] text-a_sc text-[60px]">
                <div className="flex flex-col gap-5 pl-[40px] mt-[37px]">
                    <p className="font-inria">Malayalam<br />Sentences</p>
                    <p className="font-arima">മലയാളം<br />വാക്യങ്ങൾ</p>
                    <p className="text-black font-inria text-[20px]">Learn essential Malayalam <br /> sentences to improve <br /> your everyday conversations!</p>
                </div>
                <button className="w-32 font-inria self-end mb-[42px] text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl ml-[130px]">
                    <p>Start</p>
                </button>
                <img src="/assets/amma.png" alt="A traditional representation of Amma" className="w-[600px] relative left-8" />
            </div>

            <div className="px-5 mt-[50px]">
                <Divider />
            </div>

            {/* {sentences ? (
                <div className="flex flex-col items-center font-inria">
                    <p className="text-text_green my-[50px] text-[50px] font-bold">
                        {sentences[currentCategoryIndex].category}
                    </p>
                    <div className="flex flex-wrap gap-16 justify-center px-5">
                        {sentences[currentCategoryIndex].sentences.map((sentenceObject, index) => (
                            <button
                                key={index}
                                className="bg-transparent px-6 py-10 rounded-xl font-arima text-[30px] border-[3px] w-[300px] border-black text-black hover:shadow-lg hover:font-bold transition-all"
                                onClick={() => handleClick(sentenceObject)}
                            >
                                {sentenceObject.word}
                            </button>
                        ))}
                    </div>
                    <div className="flex mt-10 gap-5">
                        <button 
                            className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg" 
                            onClick={handlePrevCategory} 
                            disabled={currentCategoryIndex === 0}
                        >
                            Previous
                        </button>
                        <button 
                            className="bg-a_sc text-white px-6 py-3 rounded-xl text-lg" 
                            onClick={handleNextCategory} 
                            disabled={currentCategoryIndex === sentences.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-xl font-bold">Loading...</div>
            )}

            <div className="px-5">
                <Divider />
            </div> */}
        </div>
    );
};

export default Sentences;
