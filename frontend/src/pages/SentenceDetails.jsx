import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import NotFound from "./NottFound";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const SentenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sentences, setSentences] = useState([]);
  const [sentence, setSentence] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const res = await api.get("/api/sentences/");
        const sentenceList = res.data.Sentences;
        setSentences(sentenceList);

        const currentSentence = sentenceList.find((s) => s.id === parseInt(id));
        setSentence(currentSentence || null);

        if (currentSentence) checkUserProgress(currentSentence);
      } catch (error) {
        console.error("Error fetching sentences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, [id]);

  const checkUserProgress = async (currentSentence) => {
    try {
      const res = await api.get("/api/get_user_progress/");
      const completedSentences = res.data.completed_sentences;

      if (completedSentences.includes(currentSentence.sentence)) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const verifySentence = async () => {
    if (!sentence || verified) return;

    try {
      await api.patch("/api/update_user_progress/", {
        completed_sentences: [sentence.sentence],
      });

      setVerified(true);
      toast("Well Done! Moving to the next sentence...", {
        className: "bg-green-500 text-white border border-green-700",
      });

      setTimeout(handleNext, 1500); // Auto-navigate after 1.5s
    } catch (error) {
      console.error("Error updating user progress:", error);
    }
  };

  if (loading) return <div className="text-center text-xl font-bold">Loading...</div>;
  if (!sentence) return <NotFound />;

  const handleNext = () => {
    const currentIndex = sentences.findIndex((s) => s.id === parseInt(id));
    if (currentIndex !== -1 && currentIndex < sentences.length - 1) {
      navigate(`/sentences/${sentences[currentIndex + 1].id}`);
    } else {
      navigate("/sentences");
    }
  };

  const handlePrev = () => {
    const currentIndex = sentences.findIndex((s) => s.id === parseInt(id));
    if (currentIndex > 0) {
      navigate(`/sentences/${sentences[currentIndex - 1].id}`);
    } else {
      navigate("/sentences");
    }
  };

  return (
    <div className="bg-a_bg h-screen flex flex-col px-10 py-8 justify-center items-center text-center relative">
      <button onClick={() => navigate("/sentences")} className="absolute top-6 left-6 w-6">
        <img src="/assets/close.png" alt="Close" className="w-8 transition-transform duration-200 hover:scale-110" />
      </button>

      <button onClick={handlePrev} className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 transition-transform duration-200 hover:scale-110">
        <img src="/assets/back.png" alt="Back" className="w-14" />
      </button>

      <div className="flex flex-col justify-center items-center text-center w-full max-w-[80%] mt-[50px]">
        <h1 className="font-inria font-normal text-[60px] leading-snug break-words text-center">
          {sentence.sentence}
        </h1>
        <h3 className="font-inria font-normal text-[20px] text-gray-400 mt-3 mb-[5px] leading-tight break-words text-center">
          {sentence.english_version}
        </h3>
        <h1 className="font-inria font-normal text-[45px] text-gray-700 leading-snug break-words text-center">
          {sentence.sentence_translation}
        </h1>
      </div>

      <div className="pt-[30px] relative w-60 h-[60px] mx-auto">
        {!verified ? (
          <button onClick={verifySentence} className="w-full font-inria text-[30px] text-a_bg py-3 bg-a_sc rounded-3xl transition-transform duration-200 hover:scale-105">
            Complete
          </button>
        ) : (
          <div className="flex justify-center items-center w-full h-full pt-2">
            <img src="/assets/verified.png" alt="Verified" className="w-[60px] h-[60px]" />
          </div>
        )}
      </div>

      <button onClick={handleNext} className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 transition-transform duration-200 hover:scale-110">
        <img src="/assets/back.png" alt="Next" className="w-14 -scale-x-100" />
      </button>

      <Toaster richColors />
    </div>
  );
};

export default SentenceDetails;
