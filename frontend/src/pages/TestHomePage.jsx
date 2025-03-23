const App = () => {
  return (
    <div className="relative w-full h-screen bg-a_bg">
      {/* Background Letter "അ" with 17% opacity */}
      <div 
        className="absolute inset-0 z-[-1] flex justify-center items-center"
        style={{ 
          fontSize: '400px', 
          fontWeight: 'bold', 
          color: 'black', 
          opacity: 0.17 
        }}
      >
        അ
      </div>

      {/* Main Content Section */}
      <div className="flex flex-row justify-between items-center px-[100px] text-a_sc text-[60px]">
        <div className="flex flex-col gap-5 pl-[40px] mt-[23px]">
          <p className="font-inria">Malayalam<br />Letters</p>
          <p className="font-arima">മലയാളം<br />അക്ഷരങ്ങൾ</p>
          <p className="text-black font-inria text-[20px]">Master Malayalam script with <br /> interactive writing, AI-powered <br /> feedback, and real-world examples!</p>
        </div>
        <button className="w-32 font-inria self-end mb-[56px] text-[20px] text-a_bg py-3 bg-a_sc rounded-3xl ml-[166.5px]">
          <p>Start</p>
        </button>
        <img src="/assets/letter.png" alt="letter" className="w-[600px] inline-block" />
      </div>
    </div>
  );
};

export default App;
