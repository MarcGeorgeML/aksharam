import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    function handleClick() {
      navigate("/home")
    }

    return (
      <div className="flex flex-col justify-center items-center h-screen bg-a_bg">
        <h1 className="font-inria text-[60px] text-text_green mb-10">
          404 Error
        </h1>
        <p className="font-inria text-lg">
          The page you are looking for does not exist!
        </p>
        <button className="font-inria bg-a_sc text-a_bg text-xl px-5 py-2 rounded-xl mt-20" onClick={handleClick}>
          Home
        </button>
      </div>
    )
  }
  
  export default NotFound