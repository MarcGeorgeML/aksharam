import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "../api"; // Import the API instance

const SmartScan = () => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            setImageFile(file); // Save the actual file for sending to backend
            reader.readAsDataURL(file);
        }
    };

    const handleTranslate = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await api.post("/api/scan", formData);

            if (response.status === 200) {
                console.log("Translation result:", response.data);
                alert("Translation successful! Check the console for result.");
            } else {
                console.error("Translation failed:", response.statusText);
                alert("Translation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error sending image:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="bg-a_bg flex flex-col h-screen">
            <Navbar activeIndex={3} />
            <div className="flex items-center justify-evenly mt-10">
                <div className="flex flex-col font-inria">
                    <p className="text-a_sc text-[90px]">Smart Scan</p>
                    <p className="text-[25px]">Learn Malayalam from Images <br /> with the help of AI</p>
                </div>
                <img className="w-[400px] mr-8" src="/assets/scan.png" alt="Scan Illustration" />
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
            />
            <button 
                onClick={handleButtonClick} 
                className="bg-a_sc flex items-center justify-center gap-4 px-5 py-2 rounded-2xl w-[180px] self-center mt-10">
                <p className="text-a_bg font-inria text-[20px]">
                    Capture
                </p>
                <img className="w-12" src="/assets/camera.png" alt="Camera Icon" />
            </button>
            {image && (
                <div className="mt-10 flex items-center justify-around bg-a_bg pb-10 pt-10">
                    <div className="w-[500px]">
                        <img src={image} alt="Uploaded" className="w-[500px] rounded-2xl shadow-lg self-center" />
                    </div>
                    {/* Divider */}
                    <div className="border-l-2 border-gray-500 mx-5 h-[calc(100vh-160px)]"></div>
                    <div className="w-[500px] flex justify-center">
                        <button 
                            className="font-inria border-2 border-black rounded-xl px-6 text-xl h-14 mr-20"
                            onClick={handleTranslate}
                        >
                            Translate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartScan;
