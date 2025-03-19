import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useNavigate } from 'react-router-dom';
import api from "../api";

const Words = () => {
    const [words, setWords] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getWords();
    }, []);

    const getWords = () => {
        api
            .get("api/words")
            .then((res) => res.data.Words)
            .then((data) => {
                setWords(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const handleClick = (word) => {
        navigate(`/words/${word.id}`, { state: { word } });
    };

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
                <div className="flex flex-wrap gap-16 justify-center px-5">
                    {words ? (
                        words.map((item) => (
                            <div key={item.id}>
                                <h3>{item.category}</h3>
                                {item.words.map((wordObject, index) => ( 
                                    <p key={index} onClick={() => handleClick(wordObject)}>
                                        {wordObject.word} {/* Access word property */}
                                    </p>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
                </div>
            </div>

            <div className="px-5">
                <Divider />
            </div>
            </div>
    );
};

export default Words;
