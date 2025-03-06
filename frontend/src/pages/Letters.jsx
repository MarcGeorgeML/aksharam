import { useState, useEffect } from "react";
import api from "../api";

const Letters = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    getLetters();
  }, []);

  const getLetters = () => {
    api
      .get("/api/letters/")
      .then((res) => res.data)
      .then((data) => {
        setLetters(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="space-y-4 bg-a_bg h-screen">
      {letters.map((letter) => (
        <div key={letter.id} className="p-4 border-b">
          <h2 className="text-xl">{letter.letter}</h2>
          <ul className="ml-4">
            {letter.examples.map((example, index) => (
              <li key={index} className="text-sm">
                {example.example} - {example.translation}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Letters;
