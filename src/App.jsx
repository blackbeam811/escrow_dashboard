import "./App.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EscrowApp from "./EscrowApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, initTWE } from "tw-elements";
initTWE({ Input }, { allowReinits: true });

export default function App() {
  return (
    <div className="App h-screen">
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <EscrowApp />
    </div>
  );
}
