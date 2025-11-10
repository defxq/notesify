import { useEffect, useState } from "react";

const usePersists = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);


  return [persist, setPersist];
}
export default usePersists