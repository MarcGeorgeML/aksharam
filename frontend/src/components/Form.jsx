/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import PropTypes from "prop-types";

const Form = ({ route, method }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState("");
    const [isFlipped, setIsFlipped] = useState(method !== "login"); // Flip state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        try {
            const res = await api.post(route, { username, password });
    
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setInvalid("Invalid User");
        } finally {
            setLoading(false);
        }
    };

    const handleNewUser = () => {
        setIsFlipped((prev) => !prev); // Toggle the flip state
        setTimeout(() => {
            method === "login" ? navigate("/register") : navigate("/login");
        }, 500); // Delay navigation to match the flip animation
    };

    return (
        <div className="flex items-center h-screen bg-cover bg-no-repeat bg-[url('/assets/login_bg2.png')]">
            <button className="w-[50px] ml-[20px] mt-[10px] self-start" onClick={() => {navigate("/")}}>
                <img src="/logo.svg" alt="" />
            </button>
            <div className="w-screen flex justify-center mr-[70px]">
            <div className="relative w-[450px] h-[400px]">
                <motion.div
                    className="relative w-full h-full"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front (Login) */}
                    <div
                        className="absolute w-full h-full backface-hidden"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="bg-a_bg border-2 border-slate-800 shadow-none flex flex-col justify-center items-center rounded-2xl w-full h-full px-12"
                        >
                            <h1 className="font-inria text-[32px] text-text_green pb-5">Login</h1>
                            <p className="font-inria self-start">Username</p>
                            <input
                                className="bg-transparent border-2 border-slate-800 rounded-lg font-inria w-full h-[45px] mb-4 px-3"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <p className="font-inria self-start">Password</p>
                            <input
                                className="bg-transparent border-2 border-slate-800 rounded-lg w-full h-[45px] px-3"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="font-inria self-end text-red-600">{invalid}</p>
                            <button className="font-arima text-xl bg-a_sc px-5 py-2 rounded-xl text-a_bg mt-5" type="submit">
                                ലോഗിൻ
                            </button>
                            <button className="text-text_green font-inria mt-8" type="button" onClick={handleNewUser}>
                                Create New Account
                            </button>
                        </form>
                    </div>

                    {/* Back (Register) */}
                    <div
                        className="absolute w-full h-full backface-hidden"
                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="bg-a_bg border-2 border-slate-800 shadow-none flex flex-col justify-center items-center rounded-2xl w-full h-full px-12"
                        >
                            <h1 className="font-inria text-[32px] text-text_green pb-5">New User</h1>
                            <p className="font-inria self-start">Username</p>
                            <input
                                className="bg-transparent border-2 border-slate-800 rounded-lg font-inria w-full h-[45px] mb-4 px-3"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <p className="font-inria self-start">Password</p>
                            <input
                                className="bg-transparent border-2 border-slate-800 rounded-lg w-full h-[45px] px-3"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="font-inria self-end text-red-600">{invalid}</p>
                            <button className="font-arima text-xl bg-a_sc px-5 py-2 rounded-xl text-a_bg mt-5" type="submit">
                                രജിസ്റ്റർ
                            </button>
                            <button className="text-text_green font-inria mt-8" type="button" onClick={handleNewUser}>
                                Already have an Account
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
            </div>
        </div>
    );
}


Form.propTypes = {
    route: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
};


export default Form;
