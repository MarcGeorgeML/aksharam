import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Divider from "./Divider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import api from "../api"; // Your Axios instance or API helper

const Navbar = ({ activeIndex }) => {
    const [username, setUsername] = useState("");
    const [userProgress, setUserProgress] = useState(null);
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", path: "/home" },
        { name: "Letters", path: "/letters" },
        { name: "Words", path: "/words" },
        { name: "Sentences", path: "/sentences" },
        { name: "Smart Scan", path: "/scan" },
    ];

    // Fetch user data and progress on component mount
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
                console.log("User Progress:", response.data); // Log progress data
            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserData();
        fetchUserProgress();
    }, []);

    return (
        <nav className="bg-transparent p-4">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <button className="w-[50px] ml-5" onClick={() => navigate("/")}>
                    <img src="logo.svg" alt="Logo" />
                </button>

                {/* Navigation Links */}
                <ul className="flex justify-center space-x-[60px] py-3">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => navigate(item.path)}
                                className={`px-5 py-2 rounded-xl text-black text-[14px] font-inria transition ${
                                    index === activeIndex ? "border-2 border-gray-800" : ""
                                }`}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* User Profile Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="w-[30px] h-[28px] my-[15px] mr-5">
                            <img src="/assets/user.png" alt="User" className="w-full h-full" />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="bg-a_bg p-4 flex flex-col justify-between items-start font-inria">
                        <div className="font-inria">
                            <h2 className="text-[35px] text-text_green mb-4">Profile</h2>
                            <div className="text-start font-inria">
                                <p className="text-lg font-medium">
                                    {username ? username : "Loading..."}
                                </p>
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
