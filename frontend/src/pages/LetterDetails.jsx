/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from 'react-router-dom';
import NotFound from './NottFound';
import { useRef, useState, useEffect } from "react";
import api from "../api";

const LetterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { letter } = location.state || {};
  const canvasRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("");
	const [verified, setVerfied] = useState(false);

	useEffect(() => {
    drawLetter();
  }, [letter]);

  if (!letter) {
    return <NotFound />;
  }

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setResponseMessage("");
    drawLetter();  // Re-render the letter after clearing
  };

	const drawLetter = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const padding = 50;

		const availableWidth = canvas.width - 2 * padding;
		const availableHeight = canvas.height - 2 * padding;

		const fontSize = Math.min(availableWidth, availableHeight) * 0.8;

		ctx.font = `${fontSize}px Arial`;
		ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.fillText(letter.letter, canvas.width / 2, canvas.height / 2);
	};


  // Send the drawing to the backend
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
				setVerfied(true);
				setResponseMessage("Great Job :)")
			}
			else {
				setResponseMessage("Try Again :(")
			}
      // setResponseMessage(res.data.predicted_label || "Image sent to backend successfully.");
    } catch (error) {
      alert("Error sending image to backend.");
      console.error("Error:", error);
    }
  };

  // Go back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };


  return (
		<div className="bg-a_bg h-screen flex flex-col px-10 py-8">
			<button className="w-8 self-start" onClick={handleGoBack}>
				<img src="/assets/back.png" alt="Back" />
			</button>
			<div className="flex flex-row justify-between items-center w-full">
				{/* Left Block */}
				<div className="flex flex-col justify-center items-center flex-1">
					<h1 className="text-[200px] font-arima">{letter.letter}</h1>
					<div className='border-2 border-black text-[35px] px-10 py-10 rounded-xl'>
						<p className='font-inria mb-5'>Examples</p>
						{letter.examples && letter.examples.map((example, index) => (
							<div key={index}>
								<p>
									•{" "}
									<span className="font-arima">{example.example}</span> -{" "}
									<span className="font-inria">{example.translation}</span>
								</p>
							</div>
						))}
					</div>
				</div>
	
				{/* Divider */}
				<div className="border-l-2 border-gray-500 mx-5 h-[calc(100vh-160px)]"></div>
	
				{/* Right Block */}
				<div className="flex flex-col justify-center items-center flex-1">
					<div className='w-[50px] self-end mr-10'>
						{/* {verified ? <img src="/assets/verified.png" alt="" /> : <img src="/assets/circle.png" alt="" />} */}
						{verified && <img src="/assets/verified.png" alt="" />}
					</div>
          <div className='flex flex-col justify-center items-center'>
						<p className='font-inria text-[30px] text-text_green pb-10'>Draw !</p>
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
						<button className="font-inria self-end text-lg" onClick={clearCanvas}>
							Clear
						</button>
						<button
							className="bg-a_sc w-[100px] text-[25px] rounded-xl text-a_bg font-inria px-2 py-2 mt-8"
							onClick={sendToBackend}
						>
							Verify
						</button>
						{responseMessage && <p className="mt-10 font-inria text-[20px] text-text_green">{responseMessage}</p>}
					</div>
        </div>
			</div>
		</div>
	);
	
};

export default LetterDetails;



/*



				<div className="flex flex-col justify-center items-center pt-20">
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
          <button className="font-inria self-end text-lg" onClick={clearCanvas}>
            Clear
          </button>
          <button
            className="bg-a_sc w-[100px] text-[25px] rounded-xl text-a_bg font-inria px-2 py-2 mt-8"
            onClick={sendToBackend}
          >
            Verify
          </button>
          {responseMessage && <p className="text-gray-700 mt-2">{responseMessage}</p>}
        </div>
*/