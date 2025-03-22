/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NottFound';
import { useRef, useState, useEffect } from "react";
import api from "../api";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

const LetterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const canvasRef = useRef(null);
  const [letters, setLetters] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [verified, setVerified] = useState(false); // Tracks verification status

  // Fetch all letters for navigation
  const fetchLetters = async () => {
    try {
      const res = await api.get("/api/letters/");
      setLetters(res.data);
  
      const currentLetter = res.data.find((l) => l.id === parseInt(id));
      if (currentLetter) {
        setLetter(currentLetter);
        drawLetter(currentLetter);  // Pass the letter explicitly
        checkUserProgress(currentLetter);
        console.log(currentLetter)
      } else {
        setLetter(null);
      }
    } catch (error) {
      console.error("Error fetching letters:", error);
    }
  };
  
  const drawLetter = (letterToDraw) => {
    const canvas = canvasRef.current;
    if (!canvas || !letterToDraw) return;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const padding = 50;
    const availableWidth = canvas.width - 2 * padding;
    const availableHeight = canvas.height - 2 * padding;
    const fontSize = Math.min(availableWidth, availableHeight) * 0.8;
  
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    ctx.fillText(letterToDraw.letter, canvas.width / 2, canvas.height / 2);
  };
  

  // Check user progress
  const checkUserProgress = async () => {
    if (!letter) return;
    try {
      const res = await api.get("/api/get_user_progress/");
      const completedLetters = res.data.completed_letters;
  
      if (completedLetters.includes(letter.letter)) {
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
      await fetchLetters(); 
    };
  
    initialize();
  }, [id]);
  
  useEffect(() => {
    if (letter) {
      setVerified(false);
      drawLetter(letter); 
      checkUserProgress();
    }
  }, [letter]); 
  

  if (!letter) {
    return <NotFound />;
  }
  
  const handleNext = () => {
    const currentIndex = letters.findIndex((l) => l.id === parseInt(id));

    if (currentIndex === -1 || currentIndex === letters.length - 1) {
      navigate("/letters");
    } else {
      const nextLetter = letters[currentIndex + 1];
      navigate(`/letters/${nextLetter.id}`);
    }
  };

  const handlePrev = () => {
    const currentIndex = letters.findIndex((l) => l.id === parseInt(id));

    if (currentIndex > 0) {
      const prevLetter = letters[currentIndex - 1];
      navigate(`/letters/${prevLetter.id}`);
    } else {
      navigate("/letters");
    }
  };
  

  // Drawing functionality
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };

  const draw = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    canvasRef.current.isDrawing = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    setResponseMessage(""); // Reset response message
  
    drawLetter(letter); // Redraw the letter after clearing
  };
  


  const sendToBackend = async () => {
    const canvas = canvasRef.current;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const image = tempCanvas.toDataURL("image/png");

    try {
      const res = await api.post("/api/testcanvas/", { image });

      if (res.data.predicted_label === letter.letter) {
        setVerified(true);
        toast("Great Job !!", {
          className: "bg-blue-500 text-black border border-blue-700",
        });

        await api.patch("/api/update_user_progress/", {
          completed_letters: [letter.letter],
        });
      } else {
        toast(`Try Again :( ${res.data.predicted_label}`, {
          className: "bg-blue-500 text-black border border-blue-700",
        });
      }
    } catch (error) {
      alert("Error sending image to backend.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-a_bg h-screen flex flex-col px-10 py-8">
      <div className='flex justify-between'>
        
        <button className="w-6 self-start transition-transform duration-200 hover:scale-110" onClick={() => {navigate('/letters')}}>
          <img src="/assets/close.png" alt="Next" className="-scale-x-100" />
        </button>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        {/* Left Block */}
        <div className='flex  flex-1 justify-between items-center '> 
          <button className="w-8 self-center transition-transform duration-200 hover:scale-110" onClick={handlePrev}>
            <img src="/assets/back.png" alt="Back" />
          </button>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[200px] font-arima">{letter.letter}</h1>
            {letter.examples.length != 0 && <div className="border-2 border-black text-[28px] px-10 py-10 rounded-xl">
              <p className="font-inria mb-5">Examples</p>
              {letter.examples && letter.examples.map((example, index) => (
                <div key={index}>
                  <p>
                    •{" "}
                    <span className="font-arima">{example.example}</span> -{" "}
                    <span className="font-inria">{example.translation}</span>
                  </p>
                </div>
              ))}
            </div>}
          </div>
          <div className='w-8'>

          </div>
        </div>

        {/* Divider */}
        <div className="border-l-2 border-gray-500 mx-5 h-[calc(100vh-160px)]"></div>

        {/* Right Block */}
        <div className='flex  flex-1 justify-between items-center'>
        <div className='w-8'></div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-[50px] self-end">
              {verified && <img src="/assets/verified.png" alt="Verified" />}
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="font-inria text-[30px] text-text_green pb-10">Draw !</p>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="border-2 border-gray-500 rounded-lg bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <button className="font-inria self-end text-lg transition-transform duration-200 hover:scale-110" onClick={clearCanvas}>
                Clear
              </button>
              <button
                className="bg-a_sc w-[100px] text-[25px] rounded-xl text-a_bg font-inria px-2 py-2 mt-8 transition-transform duration-200 hover:scale-110"
                onClick={sendToBackend}
              >
                Verify
              </button>
              {responseMessage && <p className="mt-10 font-inria text-[20px] text-text_green">{responseMessage}</p>}
            </div>
            <Toaster richColors unstyled />
          </div>
          <button className="w-8 self-center transition-transform duration-200 hover:scale-110" onClick={handleNext}>
            <img src="/assets/back.png" alt="Back" className="-scale-x-100 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterDetails;
