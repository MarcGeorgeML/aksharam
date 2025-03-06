/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/Form.css"
//import LoadingIndicator from "./LoadingIndicator";

// eslint-disable-next-line react/prop-types
function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [invalid, setInvalid] = useState("")
    const navigate = useNavigate()

    const name = method == "login" ? "Login" : "New User"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        console.log(username, password, route);
    
        try {
            const res = await api.post(route, { username, password });
    
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setInvalid('Invalid User')
        } finally {
            setLoading(false);
        }
    };

    const handleNewUser = () => {
        method === "login" ? navigate("/register") : navigate("/login");
    } 

    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-no-repeat bg-[url('/assets/login_bg2.png')]">
            <form onSubmit={handleSubmit} className="bg-a_bg border-2 border-slate-800 shadow-none flex flex-col justify-center items-center rounded-2xl w-[450px] px-12 h-[400px]">
                <h1 className="font-inria text-[32px] text-text_green pb-5">{name}</h1>
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
                {/* {loading && <LoadingIndicator/>} */}
                <button className="font-arima text-xl bg-a_sc px-5 py-2 rounded-xl text-a_bg mt-5" type="submit">
                    {method === "login" ? "ലോഗിൻ" : "രജിസ്റ്റർ"}
                </button>
                <button className="text-text_green font-inria mt-8" type="button" onClick={handleNewUser}>
                    {method === "login" ? "Create New Account" : "Already have an Account"}
                </button>
            </form>
        </div>    
    )
}


export default Form