import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx';
import { Toaster } from "react-hot-toast";
import store from "./app/store";
import { Provider } from "react-redux";

// console.log("Auth token:", store.getState().auth.token);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
    <Toaster />
  </StrictMode>,
)
