import { useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";
import api from "../api"; 

const TestCanvas = () => {
  const canvasRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("");
  //const navigate = useNavigate(); 

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
  };

  // const saveImageLocally = () => {
  //   const canvas = canvasRef.current;

  //   const tempCanvas = document.createElement("canvas");
  //   tempCanvas.width = canvas.width;
  //   tempCanvas.height = canvas.height;
  //   const tempCtx = tempCanvas.getContext("2d");

  //   tempCtx.fillStyle = "white";
  //   tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  //   tempCtx.drawImage(canvas, 0, 0);

  //   const image = tempCanvas.toDataURL("image/png");

  //   const link = document.createElement("a");
  //   link.href = image;
  //   link.download = "saved_image.png";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   setResponseMessage("Image saved to your system.");
  // };

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

    api
    .post(
      "/api/testcanvas/",
      { image }
    )
    .then((res) => {
      setResponseMessage(res.data.predicted_label || "Image sent to backend successfully.");
    })
    .catch((error) => {
      setResponseMessage("Error sending image to backend.");
      console.error("Error:", error);
    });
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center space-y-4 p-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="border-2 border-gray-500 rounded-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex space-x-24">
        <button onClick={clearCanvas}>Clear</button>
        {/* <button onClick={saveImageLocally}>Save Image</button> */}
        <button onClick={sendToBackend}>Verify</button>
      </div>
      {responseMessage && <p className="text-gray-700 mt-2">{responseMessage}</p>}
    </div>
  );
};

export default TestCanvas;
