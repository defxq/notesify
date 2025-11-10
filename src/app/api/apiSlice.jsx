import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://notesify-api-6iln.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

// this is not for surviving page refreshes, its only for when you tried to fetch something and the accesstoken is expired, so it request refresh automatically and sends the original request 
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // check if the 401 is not from the login(/auth)
    let result = await baseQuery(args, api, extraOptions);
    // this will be sent if there was still persist,  
    if (!JSON.parse(localStorage.getItem("persist"))) return result;
    if (result?.error?.status === 401 && args.url !== "/auth") {
        let refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }));
            new Promise(resolve => setTimeout(resolve, 0));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
            if (refreshResult?.error?.status === 401) {
                refreshResult.error.data.message = "Your login has expired...";
            }
            return refreshResult;
        }
    }
    return result;
}

const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Note"],
    endpoints: (builder) => ({})
});

export default apiSlice;