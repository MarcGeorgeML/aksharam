import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Divider from "./Divider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import api from "../api";
import { Progress } from "@/components/ui/progress";

const Navbar = () => {
    const [username, setUsername] = useState("");
    const [userProgress, setUserProgress] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [letterProgressBar, setLetterProgressBar] = useState(0);
    const [wordProgressBar, setWordProgressBar] = useState(0);
    const navigate = useNavigate();
    const location = useLocation(); // Get current URL path

    const totalLetters = 49;
    const totalWords = 129;

    const navItems = [
        { name: "Home", path: "/home" },
        { name: "Letters", path: "/letters" },
        { name: "Words", path: "/words" },
        { name: "Sentences", path: "/sentences" },
        { name: "Smart Scan", path: "/scan" },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/api/user/");
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchUserProgress = async () => {
            try {
                const response = await api.get("/api/get_user_progress/");
                setUserProgress(response.data);
            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserData();
        fetchUserProgress();
    }, []);

    const completedLetters = userProgress?.completed_letters?.length || 0;
    const completedWords = userProgress?.completed_words?.length || 0;

    const letterProgress = (completedLetters / totalLetters) * 100;
    const wordProgress = (completedWords / totalWords) * 100;

    useEffect(() => {
        let timer1, timer2;

        if (sheetOpen) {
            timer1 = setTimeout(() => setLetterProgressBar(letterProgress), 500);
            timer2 = setTimeout(() => setWordProgressBar(wordProgress), 500);
        } else {
            setLetterProgressBar(0);
            setWordProgressBar(0);
        }

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [sheetOpen, letterProgress, wordProgress]);

    return (
        <nav className="bg-transparent p-4">
            <div className="flex justify-between items-center">
                <button className="w-[50px] ml-5" onClick={() => navigate("/")}>
                    <img src="logo.svg" alt="Logo" />
                </button>

                <ul className="flex justify-center space-x-[60px] py-3">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => navigate(item.path)}
                                className={`px-5 py-2 rounded-xl text-black text-[14px] font-inria transition hover:font-bold ${
                                    location.pathname === item.path ? "border-2 border-gray-800" : ""
                                }`}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="w-[30px] h-[28px] my-[15px] mr-5">
                            <img src="/assets/user.png" alt="User" className="w-full h-full" />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="bg-a_bg p-4 flex flex-col justify-between items-start font-inria">
                        <div className="font-inria w-full">
                            <h2 className="text-[25px] text-text_green mb-4">Profile</h2>
                            <div className="text-start font-inria">
                                <p className="text-[30px] font-medium">
                                    {username ? username : "Loading..."}
                                </p>
                            </div>
                            <p className="text-[23px] text-text_green mb-4 mt-10">Progress : </p>

                            <div className="font-inria px-[10px]">
                                <div className="flex items-center mb-2 font-inria justify-between">
                                    <h3 className="text-[20px]">Letters</h3>
                                    <p>{Math.round(letterProgress)}%</p>
                                </div>
                                <Progress value={letterProgressBar} className=" mb-12" />

                                <div className="flex items-center mb-2 font-inria justify-between">
                                    <h3 className="text-[20px]">Words</h3>
                                    <p>{Math.round(wordProgress)}%</p>
                                </div>
                                <Progress value={wordProgressBar} className="mb-12" />
                            </div>
                        </div>

                        <Button
                            className="w-[100px] mb-10 bg-red-500 text-a_bg text-[18px] self-center"
                            onClick={() => navigate("/logout")}
                        >
                            Logout
                        </Button>
                    </SheetContent>
                </Sheet>
            </div>
            <Divider />
        </nav>
    );
};

Navbar.propTypes = {
    activeIndex: PropTypes.number,
};

export default Navbar;
