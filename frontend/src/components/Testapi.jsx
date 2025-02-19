import { useEffect, useState } from "react";

const Testapi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/test/")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => setData(data.message))
            .catch(error => setError(error.message));
    }, []);

    return (
        <div>
            {error ? <p>Error: {error}</p> : <p>{data ? data : "Loading..."}</p>}
        </div>
    );
}

export default Testapi