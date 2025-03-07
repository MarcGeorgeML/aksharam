import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-screen bg-a_bg justify-between">
      <Navbar activeIndex={0}/>
      <div className="flex flex-col justify-center items-center font-inria">
        <p className="mb-10">HomePage</p>
        <button className="border-2 border-black px-3 w-20" onClick={() => {navigate("/letters")}}>
            Letters
        </button>
        <button className="mt-10 w-20" onClick={() => {navigate("/logout")}}>
            Logout
        </button>
      </div>
      <div className="mt-20"></div>
    </div>
  )
}

export default HomePage