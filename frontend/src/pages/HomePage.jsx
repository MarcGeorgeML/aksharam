import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-a_bg h-screen flex flex-col justify-center items-center">
        <p className="mb-10">HomePage</p>
        <button className="border-2 border-black px-3 w-20" onClick={() => {navigate("/letters")}}>
            Letters
        </button>
        <button className="mt-10 w-20" onClick={() => {navigate("/logout")}}>
            Logout
        </button>
    </div>
  )
}

export default HomePage