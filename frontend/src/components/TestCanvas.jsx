import { useRef, useState } from "react";

const TestCanvas = () => {
  const canvasRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("");

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.lineWidth = 8;  
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

  const saveImageLocally = () => {
    const canvas = canvasRef.current;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const image = tempCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "saved_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setResponseMessage("Image saved to your system.");
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
      const response = await fetch("http://127.0.0.1:8000/api/testcanvas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      console.log(data)
      setResponseMessage(data.predicted_label || "Image sent to backend successfully.");
    } catch (error) {
      setResponseMessage("Error sending image to backend.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="border border-gray-300"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex space-x-2">
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveImageLocally}>Save Image</button>
        <button onClick={sendToBackend}>Send to Backend</button>
      </div>
      {responseMessage && <p className="text-gray-700 mt-2">{responseMessage}</p>}
    </div>
  );
};

export default TestCanvas;
