import { useState, useEffect, useRef } from "react";
import { Link, Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import usePersists from "../../hooks/usePersists";
import  { selectCurrentToken } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import { PulseLoader } from "react-spinners";

const PersistLogin = () => {
    const [persist] = usePersists();
    const effRef = useRef(false);
    const [trueSuccess, setTrueSuccess] = useState(false);
    const token = useSelector(selectCurrentToken);
    
    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();


    useEffect(() => {
        if (effRef.current === true) { // React 18 Strict Mode // && import.meta.env.NODE_ENV !== "development"
            const verifyRefreshToken = async () => {
                try {
                    console.log("verifying refresh token");
                    await refresh().unwrap();
                    setTrueSuccess(true);
                } catch (err) {
                    console.log(err);
                }
            };
            // only if no token( when refresh ) and persist so it means when refresh and persist on
            if (!token && persist) verifyRefreshToken();
        }

        return() => effRef.current = true;
    }, []);

    let content;
    if (!token && !persist) {
        // content = <Navigate to="/login" replace/>
        console.log("failed");
        content = <Outlet />
    } else if (isLoading) {
        content = <PulseLoader color={"#2d1bf0ff"}/>
    } else if (isError) {
        console.log("error");
        content = <p>
                {error?.data?.message}
                <Link to="/login">Please log in again</Link>
                </p>
    } else if (isSuccess && trueSuccess) {
        console.log("Success");
        content = <Outlet />
    } else if (token && isUninitialized) {
        console.log("token and uninit");
        console.log(isUninitialized);
        content = <Outlet />
    }

  return content;
}
export default PersistLogin