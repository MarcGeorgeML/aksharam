import Navbar from "../components/Navbar"

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-a_bg justify-between">
      <Navbar activeIndex={0}/>
      <div className="flex flex-col justify-center items-center font-inria">
        <p className="mb-10">HomePage</p>
      </div>
      <div className="mt-10"></div>
    </div>
  )
}

export default HomePage