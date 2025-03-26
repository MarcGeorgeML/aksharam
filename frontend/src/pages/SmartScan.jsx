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

    // Reference for the bottom element to scroll to
    const bottomRef = useRef(null);

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
        <div className="bg-a_bg flex flex-col">
            <Navbar activeIndex={4} isFixed={false}/>
            <div className="relative h-[600px] w-full overflow-hidden mb-10">
            <div 
                className="absolute inset-0 bg-cover bg-center blur-lg pointer-events-none mb-10 opacity-50"
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
                <div className="flex flex-col gap-40 pl-10 mt-6">
                    <p className="font-inria">Smart Scan</p>
                    <p className="font-arima">സ്മാർട്ട് സ്കാൻ</p>
                </div>
                
                <div className="flex flex-col justify-between items-center self-start h-full pt-[80px]">
                    <p className="text-black font-inria text-[25px] border-2 border-black rounded-2xl px-10 py-16">
                        Learn Malayalam from <br />  Images with the help of AI
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

            <div className="px-5 mt-[36px]"></div>
            {/* <div className="flex items-center justify-evenly mt-10">
                <div className="flex flex-col font-inria">
                    <p className="text-a_sc text-[90px]">Smart Scan</p>
                    <p className="text-[25px]">Learn Malayalam from Images <br /> with the help of AI</p>
                </div>
                <img className="w-[400px] mr-8" src="/assets/scan.png" alt="Scan Illustration" />
            </div> */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
            />
            
            {image && (
                <div className="mt-10 flex justify-around bg-a_bg pb-[100px] pt-10">
                    <div className="w-[500px] flex flex-col">
                        <div className="font-inria text-[30px] mb-10 self-center text-text_green">
                            Original Image
                        </div>
                        <img src={image} alt="Uploaded" className="w-[500px] rounded-2xl shadow-lg self-center border-2 border-black" />
                    </div>
                    <div className="border-l-2 border-gray-500 mx-5 h-[600px]"></div>  
                    <div className="w-[500px] flex justify-center">
                        {loading ? (
                            <div className="self-center">
                                <ThreeDot variant="pulsate" color="#3D8D7A" size="medium" text="" textColor="" />
                            </div>
                        ) : boxedImage ? (
                            <div className="text-center">
                                <p className="font-inria text-[30px] mb-10 self-center text-text_green">
                                    Translation
                                </p>
                                <img
                                    src={boxedImage}
                                    alt="Boxed Image"
                                    className="rounded-2xl shadow-lg mb-5 border-2 border-black"
                                />
                                <div className="font-inria text-[20px] mt-10 text-start">
                                    {translatedText.full}
                                    {/* {Object.entries(translatedText).map(([key, value]) => (
                                        <p key={key} className="font-inria text-xl">{`${key}: ${value}`}</p>
                                    ))} */}
                                </div>
                            </div>
                        ) : (
                            <button
                                className="font-inria border-2 border-black rounded-xl px-6 text-xl h-14 self-center"
                                onClick={handleTranslate}
                            >
                                Translate
                            </button>
                        )}
                    </div>
                </div>
            )}
            {/* This div will act as the scroll target */}
            <div ref={bottomRef}></div>
        </div>
    );
};

export default SmartScan;
