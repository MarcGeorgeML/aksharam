import { useNavigate } from "react-router-dom"

const LandingPage = () => {

  const navigate = useNavigate()
  return (
    <>
    <div>LandingPage</div>
    <button onClick={() => {navigate("/home")}}>login</button>
    </>
  )
}

export default LandingPage