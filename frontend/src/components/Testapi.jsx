import { useEffect, useState } from "react";

const Testapi = () => {
    const [data, setData] = useState(null);
    //const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/test/")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => setData(data.message))
            .catch(error => console(error));
    }, []);

    return (
        <div className="h-screen flex justify-center items-center">
            <h1 className="text-red-600 font-bold text-3xl">
                { data }
            </h1>
        </div>
    );
}

export default Testapi