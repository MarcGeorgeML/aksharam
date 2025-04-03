import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import api from "../api";
import { ThreeDot } from "react-loading-indicators";

const SmartScan = () => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [boxedImage, setBoxedImage] = useState(null);
    const [imageHeight, setImageHeight] = useState("auto");  // State for image height
    const imageRef = useRef(null);  // Reference for the image

    // Reference for the bottom element to scroll to
    const bottomRef = useRef(null);

    const handleButtonClick = () => {
        setTranslatedText("");
        fileInputRef.current.click();
    };

    const handleImageLoad = () => {
        if (imageRef.current) {
            const height = imageRef.current.clientHeight + "px";
            setImageHeight(height+100);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            setImageFile(file);
            reader.readAsDataURL(file);
        }
        setBoxedImage(null);
    };

    const handleTranslate = async () => {
        if (!imageFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await api.post("/api/scan/", formData);
            setTranslatedText(response.data.translated_text);
            setBoxedImage(response.data.boxed_image);
        } catch (error) {
            console.error("Error sending image:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Auto scroll to the bottom whenever an image is uploaded or the image changes
    useEffect(() => {
        if (image) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [image]); // Depend on 'image' so the effect runs when the image is updated

    return (
        <div className="bg-a_bg flex flex-col min-h-screen">
            <Navbar activeIndex={4} isFixed={false} />
    
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden mb-10">
                <div 
                    className="absolute inset-0 bg-cover bg-center blur-lg pointer-events-none opacity-50"
                    style={{ 
                        backgroundImage: "url('/assets/scan_bg.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "500px", 
                        height: "100%", 
                        left: "50%",
                        transform: "translateX(-50%)" 
                    }}
                ></div>
    
                <div className="relative z-10 flex flex-row justify-between items-center px-40 text-text_main text-[70px] h-full">
                    <div className="flex flex-col gap-32 pl-10 mt-6">
                        <p className="font-inria">Smart Scan</p>
                        <p className="font-arima pb-10">സ്മാർട്ട് സ്കാൻ</p>
                    </div>
    
                    <div className="flex flex-col justify-between items-center self-start h-full pt-[80px]">
                        <p className="text-black font-inria text-[20px] border-2 border-black rounded-2xl px-10 py-16">
                            Convert unseen scripts into <br/> meaningful sentences, providing <br/> an opportunity for learning rather <br/> than a barrier to understanding
                        </p>
                        <button
                            onClick={handleButtonClick}
                            className="bg-text_main flex items-center justify-center gap-4 px-5 py-2 rounded-2xl w-[180px] self-center mt-10 mb-32">
                            <p className="text-a_bg font-inria text-[20px]">
                                Capture
                            </p>
                            <img className="w-12" src="/assets/camera.png" alt="Camera Icon" />
                        </button>
                    </div>
                </div>
            </div>
    
            {/* File Input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
            />
    
            {/* Display Images and Translations */}
            {image && (
                <div className="mt-10 bg-a_bg pb-[100px] pt-10">
                    <div className="flex justify-around">
                        
                        {/* Original Image */}
                        <div className="w-[500px] flex flex-col">
                            <div className="font-inria text-[30px] mb-5 self-center text-text_green">
                                Original Image
                            </div>
                            <img 
                                src={image} 
                                alt="Uploaded" 
                                ref={imageRef}  // Reference to get the image height
                                className="w-[500px] rounded-2xl shadow-lg self-center border-2 border-black" 
                                onLoad={handleImageLoad}  // Trigger function when image loads
                            />
                        </div>
    
                        <div 
                            className="border-l-2 border-gray-500 mx-5"
                            style={{ height: imageHeight }}  // Dynamic height
                        ></div>  
    
                        {/* Boxed Image */}
                        <div className="w-[500px] flex flex-col justify-between">
                            <div className="font-inria text-[30px] mb-5 self-center text-text_green">
                                Translation
                            </div>
                            {loading ? (
                                <div className="self-center">
                                    <ThreeDot variant="pulsate" color="#3D8D7A" size="medium" />
                                </div>
                            ) : boxedImage ? (
                                <img 
                                    src={boxedImage} 
                                    alt="Boxed" 
                                    className="w-[500px] rounded-2xl shadow-lg border-2 border-black self-center"
                                />
                            ) : (
                                <button
                                    className="font-inria border-2 border-black rounded-xl px-6 text-xl h-14 self-center"
                                    onClick={handleTranslate}
                                >
                                    Translate
                                </button>
                                
                            )}
                            <div></div>
                        </div>
                    </div>
    
                    {/* Translation Section */}
                    {translatedText && (
                        <div className="mt-20 px-40">
                            
                            {/* Full Translation */}
                            <div className="flex flex-col justify-center items-center">
                                <div className="font-inria text-[30px] text-text_green mb-5">
                                    Full Translation:
                                </div>
                                <div className="p-6 rounded-lg">
                                    <p className="text-[25px] font-inria text-center">{translatedText.full}</p>
                                </div>
                            </div>

                            {/* Line-by-line Translation */}
                            <div className="mt-10 flex flex-col justify-center items-center">
                                <div className="font-inria text-[30px] text-text_green mb-5">
                                    Line-by-line Translation:
                                </div>

                                <div className="grid grid-cols-1 gap-6 w-full text-[20px]">
                                    {Object.entries(translatedText)
                                        .filter(([key]) => key !== 'full')
                                        .map(([key, value]) => (
                                            <div 
                                                key={key} 
                                                className="p-4 rounded-lg flex justify-between items-center"
                                            >
                                                {/* Left text aligned to the right */}
                                                <div className="text-right font-inria w-1/2">
                                                    {key}
                                                </div>
                                                <div className="px-10">
                                                    :
                                                </div>
                                                {/* Right text aligned to the left */}
                                                <div className="text-left font-inria font-semibold w-1/2">
                                                    {value}
                                                </div>
                                            </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
    
            <div ref={bottomRef}></div>
        </div>
    );
    
};

export default SmartScan;
